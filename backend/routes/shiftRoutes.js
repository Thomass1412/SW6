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

// Get all shifts from a specific date(accessible to all authenticated users)
router.get("/all-date", verifyToken, checkAdmin, async (req, res) => {
    try {
        // Extract date from query params
        const date = req.query.date;
        if (!date) {
            return res.status(400).json({ error: "Date parameter is required" });
        }

        // Convert date string to Date object
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        // Query MongoDB for shifts on the selected date
        const shifts = await Shift.find({
            date: { $gte: startOfDay, $lte: endOfDay },
        }).populate("employee", "name email");

        if (shifts.length === 0) {
            return res.status(200).json([]); 
        }

        res.json(shifts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Create a shift (Admin only)
router.post("/create", verifyToken, checkAdmin, async (req, res) => {
    console.log("Create shift request received");
    try {
      const { startTime, endTime } = req.body;
  
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  
      if (!timeRegex.test(startTime)) {
        return res.status(400).json({ error: "Invalid startTime format. Use HH:MM (24-hour)." });
      }
  
      if (!timeRegex.test(endTime)) {
        return res.status(400).json({ error: "Invalid endTime format. Use HH:MM (24-hour)." });
      }
  
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

        // Extract date from query params
        const date = req.query.date;  
        if (!date) {
            console.log("Date parameter missing in request");
            return res.status(400).json({ error: "Date parameter is required" });
        }

        // Find the logged-in user based on Firebase email
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            console.log("User not found in DB");
            return res.status(404).json({ error: "User not found" });
        }


        //  Convert date string to Date object
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        // Query MongoDB for shifts on the selected date
        const shifts = await Shift.find({
            employee: user._id,
            date: { $gte: startOfDay, $lte: endOfDay },
        }).populate("employee", "name email");

        res.json(shifts);
    } catch (error) {
        console.error("Error fetching shifts:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
