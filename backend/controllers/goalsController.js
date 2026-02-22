const mongoose = require("mongoose");
const Goal = require("../models/Goal");
const goalsEngine = require("../services/goalsEngine");

/* GET /api/goals/overview */
const getOverview = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const [stability, impulse, savings, risk] = await Promise.all([
            goalsEngine.calculateStabilityTarget(userId),
            goalsEngine.calculateImpulseReduction(userId),
            goalsEngine.calculateSavingsProgress(userId),
            goalsEngine.calculateRiskExposure(userId),
        ]);
        res.json({ stability, impulse, savings, risk });
    } catch (err) {
        console.error("Goals overview error:", err);
        res.status(500).json({ message: "Failed to compute goals overview" });
    }
};

/* GET /api/goals/trajectory */
const getTrajectory = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const result = await goalsEngine.generateTrajectory(userId);
        res.json(result);
    } catch (err) {
        console.error("Goals trajectory error:", err);
        res.status(500).json({ message: "Failed to compute trajectory" });
    }
};

/* GET /api/goals/ai-memo */
const getAIMemo = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const result = await goalsEngine.generateAIStrategyMemo(userId);
        res.json(result);
    } catch (err) {
        console.error("Goals AI memo error:", err);
        res.status(500).json({ message: "Failed to generate AI memo" });
    }
};

/* POST /api/goals */
const createGoal = async (req, res) => {
    try {
        const { type, targetValue, horizon, riskTolerance, aiSuggestions } = req.body;
        const goal = await Goal.create({
            userId: req.user._id,
            type: type || "behavioral",
            targetValue: targetValue || 100,
            horizon: horizon || "60D",
            riskTolerance: riskTolerance || "moderate",
            aiSuggestions: aiSuggestions !== false,
            milestones: [
                { quarter: "Q1", status: "active" },
                { quarter: "Q2", status: "pending" },
                { quarter: "Q3", status: "pending" },
                { quarter: "Q4", status: "pending" },
            ],
        });
        res.status(201).json(goal);
    } catch (err) {
        console.error("Create goal error:", err);
        res.status(500).json({ message: "Failed to create goal" });
    }
};

/* GET /api/goals/milestones */
const getMilestones = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const milestones = await goalsEngine.computeQuarterlyMilestones(userId);
        res.json({ milestones });
    } catch (err) {
        console.error("Goals milestones error:", err);
        res.status(500).json({ message: "Failed to compute milestones" });
    }
};

/* GET /api/goals/impact-summary */
const getImpactSummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const result = await goalsEngine.computeImpactSummary(userId);
        res.json(result);
    } catch (err) {
        console.error("Goals impact error:", err);
        res.status(500).json({ message: "Failed to compute impact summary" });
    }
};

module.exports = { getOverview, getTrajectory, getAIMemo, createGoal, getMilestones, getImpactSummary };
