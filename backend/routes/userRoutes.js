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


module.exports = router;
