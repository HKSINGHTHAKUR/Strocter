const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

// GET /api/auth/me
router.get("/me", protect, authController.getMe);

// Google OAuth routes
router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallback);

// Forgot password and reset password routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
