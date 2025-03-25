const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Shift = require("../models/shift");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkAdmin } = require("../middlewares/roleMiddleware");
const { geocode, calculateDistanceMeters } = require("../utils/locationUtils"); // Assuming helpers
const dayjs = require("dayjs");

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
    const { date, start, end } = req.query;

    // Ensure at least one valid query method
    if (!date && (!start || !end)) {
      return res.status(400).json({ error: "Provide either ?date= or ?start=&end=" });
    }

    // Find user based on Firebase email
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prepare date filter for the MongoDB query
    let dateFilter = {};
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      dateFilter = { date: { $gte: startOfDay, $lte: endOfDay } };
    } else if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      dateFilter = { date: { $gte: startDate, $lte: endDate } };
    }

    // Query for shifts matching employee and date filter
    const shifts = await Shift.find({
      employee: user._id,
      ...dateFilter,
    }).populate("employee", "name email");

    res.json(shifts);
  } catch (error) {
    console.error("Error fetching shifts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/sign-in", verifyToken, async (req, res) => {
  const { shiftId, location, timestamp } = req.body;
  const userId = req.user.id;

  try {
    const shift = await Shift.findById(shiftId);
    if (!shift) return res.status(404).json({ error: "Shift not found" });

    if (shift.status !== "scheduled") {
      return res.status(400).json({ error: `Shift already ${shift.status}` });
    }

    const shiftStart = dayjs(`${dayjs(shift.date).format("YYYY-MM-DD")}T${shift.startTime}`);
    const now = dayjs(timestamp);

    const minutesBefore = shiftStart.diff(now, "minute");
    if (minutesBefore > 100) {
      return res.status(400).json({ error: "Too early to sign in." });
    }

    if (minutesBefore < -300) {
      return res.status(400).json({ error: "Too late to sign in." });
    }

    const shiftCoords = await geocode(shift.location); // Ex: returns { lat, lng }
    const distance = calculateDistanceMeters(
      location.latitude,
      location.longitude,
      shiftCoords.lat,
      shiftCoords.lng
    );

    if (distance > 100) {
      return res.status(400).json({ error: `Too far from shift location (${Math.round(distance)}m)` });
    }

    // Update shift
    shift.status = "signed-in";
    shift.employee = userId; // Optional: assign employee on sign-in
    await shift.save();

    res.json({ message: "Successfully signed in", shift });

  } catch (err) {
    console.error("Sign-in error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/complete", verifyToken, async (req, res) => {
  const { shiftId, location, timestamp } = req.body;
  const userId = req.user.id;

  try {
    const shift = await Shift.findById(shiftId);
    if (!shift) return res.status(404).json({ error: "Shift not found" });

    const shiftEnd = dayjs(`${dayjs(shift.date).format("YYYY-MM-DD")}T${shift.endTime}`);
    const now = dayjs(timestamp);
    const diff = Math.abs(shiftEnd.diff(now, "minute"));

    if (diff > 10) {
      return res.status(400).json({ error: "You can only complete the shift within 10 minutes of end time." });
    }

    const shiftCoords = await geocode(shift.location);
    const distance = calculateDistanceMeters(
      location.latitude,
      location.longitude,
      shiftCoords.lat,
      shiftCoords.lng
    );

    if (distance > 100) {
      return res.status(400).json({ error: `Too far from shift location (${Math.round(distance)}m)` });
    }

    shift.status = "completed";
    await shift.save();

    await ShiftLog.create({
      user: userId,
      shift: shiftId,
      time: timestamp,
      location,
      type: "completed"
    });

    res.json({ message: "Shift successfully completed." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a shift by ID (accessible to all authenticated users) 
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id).populate("employee", "name role");
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    res.json(shift);
  } catch (err) {
    console.error("Error fetching shift by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;


module.exports = router;
