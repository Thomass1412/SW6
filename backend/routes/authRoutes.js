const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import User model
const admin = require("../config/firebase"); // Import Firebase Admin

router.post('/signup', async (req, res) => {
    const { name, email, password, role} = req.body;
    try {
        const userExists = await User.findOne({ email });  

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { idToken } = req.body; // Expect Firebase ID Token from frontend

    if (!idToken) {
        return res.status(400).json({ error: "Missing ID Token" });
    }

    try {
        // Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const email = decodedToken.email;

        // Find user in MongoDB
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Login successful",
            accessToken: token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
            redirect: user.role === "Admin" ? "/managerScreens/home" : "/employeeScreens/home",
        });

    } catch (error) {
        console.error("Firebase Authentication Error:", error);
        return res.status(401).json({ error: "Invalid Firebase Token" });
    }
});


module.exports = router;


