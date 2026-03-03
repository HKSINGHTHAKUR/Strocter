/* ── aiController.js ──
   Controller for Strocter AI chat.
   Aggregates user analytics from existing engines, then calls the AI service.
*/

const Transaction = require("../models/Transaction");
const analyticsEngine = require("../services/analyticsEngine");
const impulseEngine = require("../services/impulseEngine");
const { askStrocterAI } = require("../services/strocterAI");

/**
 * POST /api/ai/chat
 * Body: { message: string }
 */
const chatWithAI = async (req, res) => {
    try {
        const userId = req.user._id;
        const { message, context } = req.body;

        if (!message || typeof message !== "string" || message.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        // Sanitize — limit message length
        const sanitizedMessage = message.trim().slice(0, 1000);

        // ── Aggregate analytics from existing engines ──

        // 1. Total spent last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentExpenses = await Transaction.find({
            user: userId,
            type: "expense",
            createdAt: { $gte: thirtyDaysAgo },
        }).lean();

        const totalSpentLast30Days = recentExpenses.reduce((sum, t) => sum + t.amount, 0);

        // 2. Emotion distribution
        const emotionCounts = {};
        recentExpenses.forEach((t) => {
            const emotion = (t.emotion || "neutral").toLowerCase();
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });

        const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";

        // 3. Behavioral metrics from analyticsEngine
        const behavioralMetrics = await analyticsEngine.calculateBehavioralMetrics(userId);
        const emotionalSpendingPct = parseFloat(behavioralMetrics.emotionalSpending.value) || 0;
        const controlScore = parseFloat(behavioralMetrics.resilienceScore.value) || 0;
        const volatility = behavioralMetrics.volatilityIndex.value || "N/A";

        // 4. Impulse score from impulseEngine
        const impulseData = await impulseEngine.calculateImpulseScore(userId);
        const impulseScore = impulseData.score || 0;

        // 5. Late night spending
        const lateNightData = await impulseEngine.detectLateNightWindow(userId);
        const lateNightSpendingPercent = lateNightData.percentage || 0;

        // 6. Top spending category
        const categoryCounts = {};
        recentExpenses.forEach((t) => {
            categoryCounts[t.category] = (categoryCounts[t.category] || 0) + t.amount;
        });
        const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

        // ── Build analytics summary (NEVER raw transactions) ──
        const analyticsSummary = {
            totalSpentLast30Days,
            emotionalSpendingPct,
            topEmotion,
            emotionDistribution: emotionCounts,
            impulseScore,
            controlScore,
            lateNightSpendingPercent,
            volatility,
            topCategory,
        };

        // ── Call AI ──
        const aiReply = await askStrocterAI(analyticsSummary, sanitizedMessage);

        res.status(200).json({
            success: true,
            reply: aiReply,
        });
    } catch (error) {
        console.error("Strocter AI error:", error.message);
        res.status(500).json({
            success: false,
            message: "AI service temporarily unavailable. Please try again.",
        });
    }
};

module.exports = { chatWithAI };
