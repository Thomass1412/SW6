const express = require("express");
const { getShifts } = require("../controllers/shiftController");

const router = express.Router();

router.get("/", getShifts);

module.exports = router;
