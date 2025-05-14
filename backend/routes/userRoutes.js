const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkAdmin } = require("../middlewares/roleMiddleware");

// Get all employees 
router.get("/employees", verifyToken, checkAdmin, async (req, res) => {
    try {
      const { jobTitle } = req.query;
  
      const query = { role: "User" };
  
      if (jobTitle && jobTitle !== "None") {
        query.jobTitle = { $in: [jobTitle] }; 
      }
  
      const users = await User.find(query, "-password");
      res.json(users);
    } catch (error) {
      console.error(" Error fetching employees:", error);
      res.status(500).json({ error: error.message });
    }
  })
  

router.get("/get-user/:id", verifyToken, checkAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a user 
router.delete("/delete/:id", verifyToken, checkAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/users/:id/push-token
router.post('/:id/push-token', async (req, res) => {
  const { pushToken } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, { pushToken });
    res.status(200).json({ message: 'Push token saved.' });
  } catch (err) {
    res.status(500).json({ error: 'Could not save token' });
  }
});

router.put("/update/:id", verifyToken, checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, jobTitle = [], hoursPerWeek } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email, and phone are required." });
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // If email is changing, ensure new one isn't already taken
    if (normalizedEmail !== user.email) {
      const existingEmailUser = await User.findOne({ email: normalizedEmail });
      if (existingEmailUser && existingEmailUser._id.toString() !== id) {
        return res.status(400).json({ message: "Email already in use by another user." });
      }
    }

    // Validate jobTitle entries against allowed roles
    const validRoles = ["Production", "Licorice Maker"];
    const invalidRoles = jobTitle.filter(role => !validRoles.includes(role));
    if (invalidRoles.length > 0) {
      return res.status(400).json({ message: `Invalid job roles: ${invalidRoles.join(", ")}` });
    }

    // Update fields
    user.name = name;
    user.email = normalizedEmail;
    user.phone = phone;
    user.jobTitle = jobTitle;
    if (typeof hoursPerWeek === "number") {
      user.hoursPerWeek = hoursPerWeek;
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
