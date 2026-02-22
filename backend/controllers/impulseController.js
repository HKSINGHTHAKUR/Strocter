const mongoose = require("mongoose");
const impulseEngine = require("../services/impulseEngine");

/* GET /api/impulse/overview */
const getOverview = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        const [
            impulse,
            stress,
            lateNight,
            volatility,
            triggerCat,
            peakVuln,
            emotionalPattern,
            intensity,
        ] = await Promise.all([
            impulseEngine.calculateImpulseScore(userId),
            impulseEngine.calculateStressCorrelation(userId),
            impulseEngine.detectLateNightWindow(userId),
            impulseEngine.calculateVolatility(userId),
            impulseEngine.getTopTriggerCategory(userId),
            impulseEngine.getPeakVulnerability(userId),
            impulseEngine.getEmotionalPattern(userId),
            impulseEngine.getIntensityIndex(userId),
        ]);

        res.json({
            impulseScore: impulse.score,
            impulseBaseline: impulse.baseline,
            stressCorrelation: stress.percentage,
            stressVsAverage: stress.vsAverage,
            lateNightWindow: lateNight.window,
            lateNightStatus: lateNight.status,
            volatility: volatility.level,
            volatilityTrend: volatility.trend,
            topTriggerCategory: triggerCat.category,
            topTriggerDetail: triggerCat.detail,
            peakVulnerability: peakVuln.time,
            peakVulnerabilityContext: peakVuln.context,
            emotionalPattern: emotionalPattern.pattern,
            emotionalCorrelation: emotionalPattern.correlation,
            intensityIndex: intensity.level,
            intensityAvg: intensity.avgPerEvent,
        });
    } catch (err) {
        console.error("Impulse overview error:", err);
        res.status(500).json({ message: "Failed to compute impulse overview" });
    }
};

/* GET /api/impulse/timeline?range=24h|7d|30d */
const getTimeline = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const range = req.query.range || "24h";
        const timeline = await impulseEngine.detectSpikes(userId, range);
        res.json({ timeline });
    } catch (err) {
        console.error("Impulse timeline error:", err);
        res.status(500).json({ message: "Failed to compute timeline" });
    }
};

/* POST /api/impulse/simulate */
const runSimulation = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const { frictionValue = 65 } = req.body;
        const result = await impulseEngine.runSimulation(userId, frictionValue);
        res.json(result);
    } catch (err) {
        console.error("Impulse simulation error:", err);
        res.status(500).json({ message: "Failed to run simulation" });
    }
};

/* GET /api/insights/impulse-spending (legacy — used by insightRoute) */
const getImpulseSpending = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const impulse = await impulseEngine.calculateImpulseScore(userId);
        res.json({
            impulseScore: impulse.score,
            baseline: impulse.baseline,
        });
    } catch (err) {
        console.error("Impulse spending error:", err);
        res.status(500).json({ message: "Failed to compute impulse spending" });
    }
};

/* ── Pure calculation function (used by dashboardController) ── */
const calculateImpulse = async (userId) => {
    const id = new mongoose.Types.ObjectId(userId);
    const result = await impulseEngine.calculateImpulseScore(id);
    return {
        impulseScore: result.score,
        baseline: result.baseline,
    };
};

module.exports = { getOverview, getTimeline, runSimulation, getImpulseSpending, calculateImpulse };
