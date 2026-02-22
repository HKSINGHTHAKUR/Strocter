const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getWealthFlow } = require("../controllers/wealthFlowController");

// GET /api/analytics/wealth-flow (protected)
router.get("/wealth-flow", protect, getWealthFlow);

module.exports = router;
