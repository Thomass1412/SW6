const express = require("express");
const { authTest } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
import { auth } from 'firebase-admin';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

const router = express.Router();

// Root Endpoint for API Status
router.get("/", (req, res) => {
    res.send("API is running!");
});

// Protected Endpoint
router.get("/protected", verifyToken, authTest);


router.post('/signup', async (req, res) => {
    const { name, email, password, role} = req.body;
    const userExists = await User.findOne({ email }); 
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    } 
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

    res.status(201).json(newUser);
});

router.post('/login', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


