const express = require("express");
const { authTest } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Root Endpoint for API Status
router.get("/", (req, res) => {
    res.send("API is running!");
});

// Protected Endpoint
router.get("/protected", verifyToken, authTest);

module.exports = router;
