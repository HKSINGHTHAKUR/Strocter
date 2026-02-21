const Transaction = require("../models/Transaction");

const calculateImpulse = async (userId) => {
    // Last 14 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const transactions = await Transaction.find({
        user: userId,
        type: "expense",
        createdAt: { $gte: fourteenDaysAgo },
    });

    const totalTransactions = transactions.length;

    if (totalTransactions === 0) {
        return {
            totalTransactions: 0,
            lateNightTransactions: 0,
            weekendTransactions: 0,
            impulseScore: 0,
            riskLevel: "Low",
        };
    }

    let lateNightTransactions = 0;
    let weekendTransactions = 0;

    for (const txn of transactions) {
        const date = new Date(txn.createdAt);
        const hour = date.getHours();
        const day = date.getDay(); // 0 = Sunday, 6 = Saturday

        // Late Night: 10PM – 5AM
        if (hour >= 22 || hour < 5) {
            lateNightTransactions++;
        }

        // Weekend: Saturday or Sunday
        if (day === 0 || day === 6) {
            weekendTransactions++;
        }
    }

    const impulseScore = Math.round(
        ((lateNightTransactions + weekendTransactions) / totalTransactions) * 100
    );

    let riskLevel = "Low";
    if (impulseScore > 60) {
        riskLevel = "High";
    } else if (impulseScore >= 30) {
        riskLevel = "Moderate";
    }

    return {
        totalTransactions,
        lateNightTransactions,
        weekendTransactions,
        impulseScore,
        riskLevel,
    };
};

const getImpulseSpending = async (req, res) => {
    try {
        const result = await calculateImpulse(req.user._id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getImpulseSpending, calculateImpulse };
