const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Shift = require("../models/shift");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkAdmin } = require("../middlewares/roleMiddleware");

// Get all shifts (accessible to all authenticated users)
router.get("/", verifyToken, async (req, res) => {
    try {
        const shifts = await Shift.find().populate("employee", "name email");
        res.json(shifts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a shift (Admin only)
router.post("/create", verifyToken, checkAdmin, async (req, res) => {
    try {
        const shift = new Shift(req.body);
        await shift.save();
        res.status(201).json(shift);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a shift (Admin only)
router.delete("/:id", verifyToken, checkAdmin, async (req, res) => {
    try {
        const shift = await Shift.findByIdAndDelete(req.params.id);
        if (!shift) return res.status(404).json({ message: "Shift not found" });
        res.json({ message: "Shift deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/my-shifts", verifyToken, async (req, res) => {
    try {
        // Find user by Firebase UID or email
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        console.log(`🔍 Searching shifts between ${startOfDay} and ${endOfDay}`);

        // Find shifts for this employee on the selected date
        const shifts = await Shift.find({
            employee: user._id,
            date: { $gte: startOfDay, $lte: endOfDay },
        }).populate("employee", "name email");

        console.log("Shifts Found:", shifts);
        res.json(shifts);
    } catch (error) {
        console.error("Error fetching shifts:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
