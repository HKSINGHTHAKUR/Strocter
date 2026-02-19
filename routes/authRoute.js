const express = require("express");
const router = express.Router();
const { register, loginUser } = require("../controllers/authController");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", loginUser);

module.exports = router;
