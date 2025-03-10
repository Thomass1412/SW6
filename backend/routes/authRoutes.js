const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");


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

router.post('/login', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ error: "nonono" });
    }
});

module.exports = router;


