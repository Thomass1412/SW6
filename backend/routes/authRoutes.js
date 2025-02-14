const express = require("express");
const { authTest } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
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
    const { username, email, password, role} = req.body;
    const userExists = await User.findOne({ email }); 
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    } 

    const user = await User.create({
        _id: new mongoose.Types.ObjectId(),
        username,
        email,
        password, 
        role
    });

    res.status(201).json(user);
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: null
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    } 
});

module.exports = router;


