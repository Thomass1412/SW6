const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkAdmin } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", verifyToken, checkAdmin, getAllUsers);
router.delete("/:id", verifyToken, checkAdmin, deleteUser);

module.exports = router;
