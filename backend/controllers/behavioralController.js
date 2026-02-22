const mongoose = require("mongoose");
const analyticsEngine = require("../services/analyticsEngine");

/* GET /api/analytics/behavioral-summary */
const getBehavioralSummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const metrics = await analyticsEngine.calculateBehavioralMetrics(userId);
        res.json(metrics);
    } catch (err) {
        console.error("Behavioral summary error:", err);
        res.status(500).json({ message: "Failed to compute behavioral summary" });
    }
};

/* GET /api/analytics/heatmap */
const getHeatmap = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const result = await analyticsEngine.generateHeatmap(userId);
        res.json(result);
    } catch (err) {
        console.error("Heatmap error:", err);
        res.status(500).json({ message: "Failed to generate heatmap" });
    }
};

/* GET /api/analytics/cognitive */
const getCognitive = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const result = await analyticsEngine.generateCognitiveAnalysis(userId);
        res.json(result);
    } catch (err) {
        console.error("Cognitive error:", err);
        res.status(500).json({ message: "Failed to generate cognitive analysis" });
    }
};

/* GET /api/analytics/sentiment */
const getSentiment = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const data = await analyticsEngine.generateSentimentTrend(userId);
        res.json(data);
    } catch (err) {
        console.error("Sentiment error:", err);
        res.status(500).json({ message: "Failed to generate sentiment trend" });
    }
};

/* GET /api/analytics/category-breakdown */
const getCategoryBreakdown = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const data = await analyticsEngine.calculateCategorySplit(userId);
        res.json(data);
    } catch (err) {
        console.error("Category breakdown error:", err);
        res.status(500).json({ message: "Failed to compute category breakdown" });
    }
};

module.exports = { getBehavioralSummary, getHeatmap, getCognitive, getSentiment, getCategoryBreakdown };
