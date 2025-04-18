const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Shift = require("../models/shift");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkAdmin } = require("../middlewares/roleMiddleware");
const { geocode, calculateDistanceMeters } = require("../utils/locationUtils"); //helper function
const dayjs = require("dayjs");

// get all shifts 
router.get("/", verifyToken, checkAdmin, async (req, res) => {
    try {
        const shifts = await Shift.find().populate("employee", "name email");
        res.json(shifts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//user route to fetch their shifts
router.get("/my-shifts", verifyToken, async (req, res) => {
  try {
    const { date, start, end } = req.query;

    // ensure at least one valid query method
    if (!date && (!start || !end)) {
      return res.status(400).json({ error: "Provide either ?date= or ?start=&end=" });
    }
    console.log("Decoded Firebase token:", req.user);
    // fund user
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // prepare date filter for the MongoDB query
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

    // query for shifts matching employee and date filter
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

// Get all shifts from a specific date
router.get("/all-date", verifyToken, checkAdmin, async (req, res) => {
    try {
        const date = req.query.date;
        if (!date) {
            return res.status(400).json({ error: "Date parameter is required" });
        }

        // convert date string to Date object
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

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


// Get a shift by ID 
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

// update a shift by ID
router.put("/:id", verifyToken, checkAdmin, async (req, res) => {
  try {
    const updatedShift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedShift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    res.json({ message: "Shift updated", shift: updatedShift });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})


// Create a shift 
router.post("/create", verifyToken, checkAdmin, async (req, res) => {
  console.log("Create shift request received");
  try {
    const { startTime, endTime, repeat, date, employee  } = req.body;

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeRegex.test(startTime)) {
      return res.status(400).json({ error: "Invalid startTime format. Use HH:MM (24-hour)." });
    }

    if (!timeRegex.test(endTime)) {
      return res.status(400).json({ error: "Invalid endTime format. Use HH:MM (24-hour)." });
    }

    const start = dayjs(`2023-01-01T${startTime}`);
    const end = dayjs(`2023-01-01T${endTime}`);

    if (!end.isAfter(start)) {
      return res.status(400).json({ error: "End time must be after start time." });
    }

    if (employee) {
      const overlapping = await Shift.findOne({
        employee,
        date,
        $or: [
          {
            $and: [
              { startTime: { $lte: endTime } },
              { endTime: { $gte: startTime } },
            ],
          },
        ],
      });

      if (overlapping) {
        return res.status(400).json({
          error: "This employee already has a shift that overlaps with the selected time.",
        });
      }
    }
    // create the initial shift
    const baseShift = new Shift(req.body);
    await baseShift.save();

    const createdShifts = [baseShift];

    // repeat for next 3 weeks if requested
    if (repeat === "weekly" && date) {
      for (let i = 1; i < 4; i++) {
        const newDate = dayjs(date).add(i, "week").toISOString();

        if (employee) {
          const overlapping = await Shift.findOne({
            employee,
            date,
            $or: [
              {
                $and: [
                  { startTime: { $lte: endTime } },
                  { endTime: { $gte: startTime } },
                ],
              },
            ],
          });
    
          if (overlapping) {
            return res.status(400).json({
              error: "This employee already has a shift that overlaps with the selected time.",
            });
          }
        }

        const repeatShift = new Shift({
          ...req.body,
          date: newDate,
        });

        await repeatShift.save();
        createdShifts.push(repeatShift);
      }
    }

    res.status(201).json(createdShifts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete a shift 
router.delete("/delete/:id", verifyToken, checkAdmin, async (req, res) => {
  try {
      const shift = await Shift.findByIdAndDelete(req.params.id);
      if (!shift) return res.status(404).json({ message: "Shift not found" });
      res.json({ message: "Shift deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// user route to create a unavailbility
router.post("/new-unavailability", verifyToken, async (req, res) => {
  console.log("Create unavailability request received");

  try {
    const { startTime, endTime, repeat, date } = req.body;

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = user._id;

    // validate time
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ error: "Invalid time format. Use HH:MM (24-hour)." });
    }

    const start = dayjs(`${dayjs(date).format("YYYY-MM-DD")}T${startTime}`);
    const end = dayjs(`${dayjs(date).format("YYYY-MM-DD")}T${endTime}`);
    if (!end.isAfter(start)) {
      return res.status(400).json({ error: "End time must be after start time." });
    }

    // check for overlapping shifts
    const existingShifts = await Shift.find({
      employee: userId,
      date: {
        $gte: dayjs(date).startOf("day").toDate(),
        $lte: dayjs(date).endOf("day").toDate(),
      }
    });

    const hasOverlap = existingShifts.some(shift => {
      const shiftStart = dayjs(`${dayjs(shift.date).format("YYYY-MM-DD")}T${shift.startTime}`);
      const shiftEnd = dayjs(`${dayjs(shift.date).format("YYYY-MM-DD")}T${shift.endTime}`);
      return start.isBefore(shiftEnd) && end.isAfter(shiftStart);
    });

    if (hasOverlap) {
      return res.status(400).json({ error: "You already have a shift that overlaps with this unavailability." });
    }

    // create initial unavailability
    const base = new Shift({
      employee: userId,
      date,
      startTime,
      endTime,
      status: "unavailability"
    });
    await base.save();

    const unavailabilities = [base];

    // repeat if requested
    if (repeat === "weekly") {
      for (let i = 1; i < 4; i++) {
        const newDate = dayjs(date).add(i, "week").toDate();

        const overlapping = await Shift.find({
          employee: userId,
          date: {
            $gte: dayjs(newDate).startOf("day").toDate(),
            $lte: dayjs(newDate).endOf("day").toDate(),
          }
        });

        const conflict = overlapping.some(shift => {
          const shiftStart = dayjs(`${dayjs(shift.date).format("YYYY-MM-DD")}T${shift.startTime}`);
          const shiftEnd = dayjs(`${dayjs(shift.date).format("YYYY-MM-DD")}T${shift.endTime}`);
          return dayjs(`${dayjs(newDate).format("YYYY-MM-DD")}T${startTime}`).isBefore(shiftEnd) &&
                 dayjs(`${dayjs(newDate).format("YYYY-MM-DD")}T${endTime}`).isAfter(shiftStart);
        });

        if (!conflict) {
          const repeatBlock = new Shift({
            employee: userId,
            date: newDate,
            startTime,
            endTime,
            status: "unavailability"
          });
          await repeatBlock.save();
          unavailabilities.push(repeatBlock);
        }
      }
    }

    res.status(201).json(unavailabilities);
  } catch (error) {
    console.error("Unavailability creation failed:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// user route to sign in to a shift
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

    const shiftCoords = await geocode(shift.location); // returns {lat, lon}
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
    shift.employee = userId; // assign user to shift (maybe useless)
    await shift.save();

    res.json({ message: "Successfully signed in", shift });

  } catch (err) {
    console.error("Sign-in error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// user route to complte shift 
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
    //extract location of user and shift and compare
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
    //create shift in MongoDB
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




module.exports = router;
