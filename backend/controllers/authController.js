const User = require("../models/user");
const bcrypt = require("bcryptjs");

// Register User
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login User (Firebase handles this mostly)
const loginUser = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Login successful", user });
};

module.exports = { registerUser, loginUser };
