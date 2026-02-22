const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getOverview,
    getTrajectory,
    getAIMemo,
    createGoal,
    getMilestones,
    getImpactSummary,
} = require("../controllers/goalsController");

router.get("/overview", protect, getOverview);
router.get("/trajectory", protect, getTrajectory);
router.get("/ai-memo", protect, getAIMemo);
router.post("/", protect, createGoal);
router.get("/milestones", protect, getMilestones);
router.get("/impact-summary", protect, getImpactSummary);

module.exports = router;
