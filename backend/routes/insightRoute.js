const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const checkFeatureAccess = require("../middleware/featureAccess");
const { getPremiumInsights } = require("../controllers/insightController");
const { getFinancialPersonality } = require("../controllers/personalityController");
const { getCategoryPatterns } = require("../controllers/categoryPatternController");
const { getWeeklyInsightSummary } = require("../controllers/weeklyInsightController");
const { getImpulseSpending } = require("../controllers/impulseController");
const { getFinancialRiskScore } = require("../controllers/riskScoreController");
const { getFinancialStabilityIndex } = require("../controllers/stabilityController");
const { getDashboardInsights } = require("../controllers/dashboardController");

router.get("/premium-insights", protect, checkFeatureAccess, getPremiumInsights);
router.get("/financial-personality", protect, checkFeatureAccess, getFinancialPersonality);
router.get("/category-trends", protect, checkFeatureAccess, getCategoryPatterns);
router.get("/weekly-summary", protect, checkFeatureAccess, getWeeklyInsightSummary);
router.get("/impulse-spending", protect, checkFeatureAccess, getImpulseSpending);
router.get("/risk-score", protect, checkFeatureAccess, getFinancialRiskScore);
router.get("/stability-index", protect, checkFeatureAccess, getFinancialStabilityIndex);
router.get("/dashboard", protect, checkFeatureAccess, getDashboardInsights);

module.exports = router;