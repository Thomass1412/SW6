const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user"); 
const admin = require("../config/firebase"); 
const bcrypt = require("bcrypt");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkAdmin } = require("../middlewares/roleMiddleware"); 
const nodemailer = require("nodemailer");


router.post("/signup", verifyToken, checkAdmin, async (req, res) => {
    const { name, email, phone, role = "User", jobTitle = [] } = req.body;

    try {
      const normalizedEmail = email.toLowerCase();

      // does user exist
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // create user in firebase console
      const userRecord = await admin.auth().createUser({
        email,
        displayName: name,
      });
  
      // create a placehodler password, that way user can get out of limbo
      const placeholderPassword = await bcrypt.hash("placeholder", 10);
  
      // save user in mongo
      const newUser = new User({
        name,
        email: normalizedEmail,
        phone,
        password: placeholderPassword,
        role,
        jobTitle,
        firebaseUID: userRecord.uid,
      });
  
      await newUser.save();
  
      // genrate reset link firebase
      const resetLink = await admin.auth().generatePasswordResetLink(email);
  
      // send email 
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en" style="background-color: #FFFAE8;">
          <head>
            <meta charset="UTF-8">
            <title>Welcome to Bagsværd Lakrids</title>
          </head>
          <body style="margin:0; padding:0; background-color: #FFFAE8; font-family: Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFAE8; padding: 30px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
                    <tr>
                      <td align="center" style="padding-bottom: 20px;">
                        <h1 style="color: #FF9500; font-size: 24px;">Welcome to Bagsværd Lakrids!</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; font-size: 16px; color: #333;">
                        <p>Hi ${name},</p>
                        <p>Your account has been created successfully!</p>
                        <p>Please click the button below to set your password and complete your account setup:</p>
                        <div style="text-align: center; margin: 20px 0;">
                          <a href="${resetLink}" style="background-color: #FF9500; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Set Your Password</a>
                        </div>
                        <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
                        <p style="word-break: break-all;">${resetLink}</p>
                        <br>
                        <p style="font-size: 12px; color: #999;">This link expires in 1 hour.</p>
                        <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Bagsværd Lakrids</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
        `;
      await transporter.sendMail({
        from: `No Reply <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Set Your Password",
        html: htmlContent,
      });
  
      res.status(201).json({ message: "User created and email sent", user: newUser });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: error.message });
    }
  });

router.post("/login", async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ error: "ID token is required" });
        }

        // verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log("Decoded Firebase Token:", decodedToken);

        const email = decodedToken.email?.toLowerCase();;
        if (!email) {
            return res.status(401).json({ error: "Invalid Firebase Token - No Email" });
        }

        // find user in MongoDB
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // generate Session Token 
        const sessionToken = idToken; 

        res.json({
            message: "Login successful",
            accessToken: sessionToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            redirect: user.role === "Admin" ? "/admin/(tabs)/monthlySchedule" : "/employee/(tabs)/monthlySchedule",
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(401).json({ error: "Authentication failed" });
    }
});



module.exports = router;



