const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import User model
const admin = require("../config/firebase"); // Import Firebase Admin
const bcrypt = require("bcrypt");
const { verifyToken } = require("../middlewares/authMiddleware");


router.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        // Hash password before storing in MongoDB (optional, but unnecessary since Firebase handles it)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user in MongoDB
        const newUser = new User({
            name,
            email,
            password: hashedPassword, //This is now unnecessary since Firebase handles authentication
            role,
            firebaseUID: userRecord.uid, // Store Firebase UID for reference
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Login Route
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

        // Generate Session Token (Optionally)
        const sessionToken = idToken; // OR generate your own JWT if needed.

        res.json({
            message: "Login successful",
            accessToken: sessionToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
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



