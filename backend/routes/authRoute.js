const express = require("express");
const router = express.Router();
const { register, loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", loginUser);

// GET /api/auth/me
router.get("/me", protect, require("../controllers/authController").getMe);

module.exports = router;
