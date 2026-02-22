const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { premiumOnly } = require("../middleware/premiumOnly");
const { getWealthFlow } = require("../controllers/wealthFlowController");
const {
    getBehavioralSummary,
    getHeatmap,
    getCognitive,
    getSentiment,
    getCategoryBreakdown,
} = require("../controllers/behavioralController");

// Existing
router.get("/wealth-flow", protect, premiumOnly, getWealthFlow);

// Behavioral Analytics — all premium-gated
router.get("/behavioral-summary", protect, premiumOnly, getBehavioralSummary);
router.get("/heatmap", protect, premiumOnly, getHeatmap);
router.get("/cognitive", protect, premiumOnly, getCognitive);
router.get("/sentiment", protect, premiumOnly, getSentiment);
router.get("/category-breakdown", protect, premiumOnly, getCategoryBreakdown);

module.exports = router;
