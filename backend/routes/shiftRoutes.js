const express = require("express");
const Shift = require("../models/shift");

const router = express.Router();

// Create a shift
router.post("/shift", async (req, res) => {
    try {
        const { employeeName, date, startTime, endTime } = req.body;
        const shift = new Shift({ employeeName, date, startTime, endTime });
        await shift.save();
        res.status(201).json(shift);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all shifts
router.get("/shifts", async (req, res) => {
    try {
        const shifts = await Shift.find();
        res.json(shifts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a shift
router.delete("/shift/:id", async (req, res) => {
    try {
        const shift = await Shift.findByIdAndDelete(req.params.id);
        if (!shift) return res.status(404).json({ message: "Shift not found" });
        res.json({ message: "Shift deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
