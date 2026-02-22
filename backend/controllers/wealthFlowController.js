const Transaction = require("../models/Transaction");

/**
 * GET /api/analytics/wealth-flow
 * Returns weekly emotional vs logical spend breakdown.
 */
const getWealthFlow = async (req, res) => {
    try {
        const userId = req.user._id;

        const transactions = await Transaction.find({
            user: userId,
            type: "expense",
        })
            .sort({ createdAt: 1 })
            .lean();

        if (!transactions.length) {
            return res.status(200).json({ flowData: [] });
        }

        // Emotions classified as "emotional" spending
        const emotionalEmotions = [
            "stressed",
            "impulsive",
            "sad",
            "excited",
            "anxious",
            "bored",
            "happy",
        ];

        // Group transactions by ISO week
        const weekMap = {};

        transactions.forEach((txn) => {
            const date = new Date(txn.createdAt);
            const yearStart = new Date(date.getFullYear(), 0, 1);
            const weekNum = Math.ceil(
                ((date - yearStart) / 86400000 + yearStart.getDay() + 1) / 7
            );
            const key = `W${weekNum}`;

            if (!weekMap[key]) {
                weekMap[key] = { name: key, emotionalSpend: 0, logicalAllocation: 0 };
            }

            const emotion = (txn.emotion || "").toLowerCase();
            if (emotionalEmotions.includes(emotion)) {
                weekMap[key].emotionalSpend += txn.amount;
            } else {
                weekMap[key].logicalAllocation += txn.amount;
            }
        });

        const flowData = Object.values(weekMap).slice(-7); // last 7 weeks

        return res.status(200).json({ flowData });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
};

module.exports = { getWealthFlow };
