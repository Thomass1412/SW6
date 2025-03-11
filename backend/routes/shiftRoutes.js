const express = require("express");
const router = express.Router();
const Shift = require("../models/Shift");
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
router.post("/", verifyToken, checkAdmin, async (req, res) => {
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

module.exports = router;
