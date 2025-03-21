const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkAdmin } = require("../middlewares/roleMiddleware");

// Get all employees (Admin only)
router.get("/employees", verifyToken, checkAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: "User" }, "-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a user (Admin only)
router.delete("/:id", verifyToken, checkAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
