const { calculateImpulse } = require("./impulseController");
const { calculateRisk } = require("./riskScoreController");
const { calculateCategoryPatterns } = require("./categoryPatternController");
const { calculateWeeklySummary } = require("./weeklyInsightController");
const { calculatePersonality } = require("./personalityController");
const { calculateStability } = require("./stabilityController");

const getDashboardInsights = async (req, res) => {
    try {
        const userId = req.user._id;

        const [stability, impulse, risk, categoryTrend, weeklySummary, personality] =
            await Promise.all([
                calculateStability(userId),
                calculateImpulse(userId),
                calculateRisk(userId),
                calculateCategoryPatterns(userId),
                calculateWeeklySummary(userId),
                calculatePersonality(userId),
            ]);

        return res.status(200).json({
            stability,
            impulse,
            risk,
            categoryTrend,
            weeklySummary,
            personality,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getDashboardInsights };
