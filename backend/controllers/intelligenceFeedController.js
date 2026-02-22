const Transaction = require("../models/Transaction");

/**
 * Maps category / emotion to a psychological intent label.
 */
const getIntent = (category, emotion) => {
    const cat = (category || "").toLowerCase();
    const emo = (emotion || "").toLowerCase();

    if (["investment", "savings", "mutual fund"].includes(cat)) return "INVESTMENT";
    if (["impulse", "impulsive"].includes(emo) || cat === "entertainment")
        return "IMPULSE";
    if (
        ["groceries", "food", "health", "utilities", "rent", "education"].includes(cat)
    )
        return "LOGICAL";
    if (["stressed", "sad", "anxious", "bored"].includes(emo)) return "EMOTIONAL";

    return "LOGICAL";
};

/**
 * Maps category / emotion to an impact label.
 */
const getImpact = (category, emotion, amount) => {
    const emo = (emotion || "").toLowerCase();
    if (["impulsive", "stressed"].includes(emo) && amount > 100) return "High";
    if (amount > 500) return "High";
    if (amount > 100) return "Medium";
    return "Low";
};

/**
 * Generates a short human-readable impact description.
 */
const getImpactDescription = (intent, category) => {
    const descriptions = {
        LOGICAL: "Nutritional ROI High",
        IMPULSE: "Dopamine Trigger",
        INVESTMENT: "Skill Appreciation",
        EMOTIONAL: "Stress Response",
    };
    return descriptions[intent] || "Efficiency Offset";
};

/**
 * GET /api/transactions/intelligence-feed
 * Returns latest transactions enriched with psychological metadata.
 */
const getIntelligenceFeed = async (req, res) => {
    try {
        const userId = req.user._id;

        const transactions = await Transaction.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const feed = transactions.map((txn) => {
            const intent = getIntent(txn.category, txn.emotion);
            const impact = getImpact(txn.category, txn.emotion, txn.amount);
            const impactDescription = getImpactDescription(intent, txn.category);

            return {
                id: txn._id,
                activity: txn.note || txn.category,
                subtitle: `${txn.type === "expense" ? "Expense" : "Income"} • ${new Date(txn.createdAt).toLocaleDateString()}`,
                psychologicalIntent: intent,
                impact: impactDescription,
                impactLevel: impact,
                value: txn.type === "expense" ? -txn.amount : txn.amount,
            };
        });

        return res.status(200).json({ feed });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
};

module.exports = { getIntelligenceFeed };
