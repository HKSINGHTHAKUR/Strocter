const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { premiumOnly } = require("../middleware/premiumOnly");
const {
    getOverview,
    getTrajectory,
    getAIMemo,
    createGoal,
    getMilestones,
    getImpactSummary,
} = require("../controllers/goalsController");

router.get("/overview", protect, premiumOnly, getOverview);
router.get("/trajectory", protect, premiumOnly, getTrajectory);
router.get("/ai-memo", protect, premiumOnly, getAIMemo);
router.post("/", protect, premiumOnly, createGoal);
router.get("/milestones", protect, premiumOnly, getMilestones);
router.get("/impact-summary", protect, premiumOnly, getImpactSummary);

module.exports = router;
