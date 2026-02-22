const mongoose = require("mongoose");
const wealthEngine = require("../services/wealthEngine");

/* GET /api/wealth/overview */
const getOverview = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const [stability, risk, savings, buffer] = await Promise.all([
            wealthEngine.calculateStabilityIndex(userId),
            wealthEngine.calculateRiskExposure(userId),
            wealthEngine.calculateSavingsGrowth(userId),
            wealthEngine.calculateFinancialBuffer(userId),
        ]);
        res.json({
            stabilityIndex: stability.index,
            stabilityMom: stability.mom,
            riskExposure: risk.level,
            riskDetail: risk.detail,
            savingsGrowth: savings.percentage,
            savingsBenchmark: savings.benchmark,
            financialBuffer: buffer.months,
            bufferStatus: buffer.status,
        });
    } catch (err) {
        console.error("Wealth overview error:", err);
        res.status(500).json({ message: "Failed to compute wealth overview" });
    }
};

/* GET /api/wealth/trend?range=6M|1Y|3Y */
const getTrend = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const range = req.query.range || "1Y";
        const result = await wealthEngine.generateTrendProjection(userId, range);
        res.json(result);
    } catch (err) {
        console.error("Wealth trend error:", err);
        res.status(500).json({ message: "Failed to compute trend" });
    }
};

/* GET /api/wealth/radar */
const getRadar = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const result = await wealthEngine.calculateRadarValues(userId);
        res.json(result);
    } catch (err) {
        console.error("Wealth radar error:", err);
        res.status(500).json({ message: "Failed to compute radar" });
    }
};

/* GET /api/wealth/allocation */
const getAllocation = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const result = await wealthEngine.calculateAssetAllocation(userId);
        res.json(result);
    } catch (err) {
        console.error("Wealth allocation error:", err);
        res.status(500).json({ message: "Failed to compute allocation" });
    }
};

/* GET /api/wealth/outlook */
const getOutlook = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const result = await wealthEngine.generateStrategicOutlook(userId);
        res.json(result);
    } catch (err) {
        console.error("Wealth outlook error:", err);
        res.status(500).json({ message: "Failed to compute outlook" });
    }
};

module.exports = { getOverview, getTrend, getRadar, getAllocation, getOutlook };
