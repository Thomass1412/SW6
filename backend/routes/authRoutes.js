const express = require("express");
const { authTest } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/protected", verifyToken, authTest);

module.exports = router;
