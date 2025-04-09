const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import User model
const admin = require("../config/firebase"); // Import Firebase Admin
const bcrypt = require("bcrypt");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkAdmin } = require("../middlewares/roleMiddleware"); 
const nodemailer = require("nodemailer");


router.post("/signup", verifyToken, checkAdmin, async (req, res) => {
    const { name, email, phone, role = "User", jobTitle = [] } = req.body;
  
    try {
      // 1. Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // 2. Create Firebase user (no password)
      const userRecord = await admin.auth().createUser({
        email,
        displayName: name,
      });
  
      // 3. Optionally store a placeholder password in Mongo (not required)
      const placeholderPassword = await bcrypt.hash("placeholder", 10);
  
      // 4. Store user in your DB
      const newUser = new User({
        name,
        email,
        phone,
        password: placeholderPassword,
        role,
        jobTitle,
        firebaseUID: userRecord.uid,
      });
  
      await newUser.save();
  
      // 5. Generate Firebase reset link
      const resetLink = await admin.auth().generatePasswordResetLink(email);
  
      // 6. Email the link using Nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
  
      await transporter.sendMail({
        from: `"Shift Manager" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Set Your Password",
        text: `Hi ${name},\n\nYour account has been created.\nClick the link below to set your password:\n\n${resetLink}\n\nThis link expires in 1 hour.\n\n- Your Team`,
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

        // Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log("Decoded Firebase Token:", decodedToken);

        const email = decodedToken.email;
        if (!email) {
            return res.status(401).json({ error: "Invalid Firebase Token - No Email" });
        }

        // Find user in MongoDB
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate Session Token 
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



