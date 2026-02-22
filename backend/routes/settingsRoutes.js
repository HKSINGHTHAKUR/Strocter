const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getSettings, updateSettings, resetSettings } = require("../controllers/settingsController");

router.get("/", protect, getSettings);
router.put("/", protect, updateSettings);
router.post("/reset", protect, resetSettings);

module.exports = router;
