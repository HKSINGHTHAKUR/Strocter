const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { premiumOnly } = require("../middleware/premiumOnly");
const { chatWithAI } = require("../controllers/aiController");

// POST /api/ai/chat — Protected + Premium
router.post("/chat", protect, premiumOnly, chatWithAI);

module.exports = router;
