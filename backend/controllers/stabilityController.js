const Transaction = require("../models/Transaction");

const calculateStability = async (userId) => {
    // Fetch last 30 days of expense transactions
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await Transaction.find({
        user: userId,
        type: "expense",
        createdAt: { $gte: thirtyDaysAgo },
    });

    if (transactions.length === 0) {
        return {
            financialHealthScore: 100,
            healthLevel: "Stable",
            message: "No spending data yet.",
        };
    }

    // --- Calculate spending metrics ---
    let totalSpending = 0;
    let highestExpense = 0;
    let lateNightCount = 0;
    let weekendCount = 0;

    for (const txn of transactions) {
        totalSpending += txn.amount;

        if (txn.amount > highestExpense) {
            highestExpense = txn.amount;
        }

        const date = new Date(txn.createdAt);
        const hour = date.getHours();
        const day = date.getDay(); // 0 = Sunday, 6 = Saturday

        // Late night: 10PM – 5AM
        if (hour >= 22 || hour < 5) {
            lateNightCount++;
        }

        // Weekend
        if (day === 0 || day === 6) {
            weekendCount++;
        }
    }

    const avgDailySpending = totalSpending / 30;
    const volatilityScore = Math.round((highestExpense / avgDailySpending) * 100) / 100;

    // --- Impulse Score ---
    const totalTransactions = transactions.length;
    const impulseScore = Math.round(((lateNightCount + weekendCount) / totalTransactions) * 100 * 100) / 100;

    // --- Stability Score (0–100) ---
    let stabilityScore = 100;

    if (volatilityScore > 4) {
        stabilityScore -= 25;
    } else if (volatilityScore >= 2) {
        stabilityScore -= 15;
    }

    if (impulseScore > 60) {
        stabilityScore -= 25;
    } else if (impulseScore >= 30) {
        stabilityScore -= 15;
    }

    stabilityScore = Math.max(stabilityScore, 0);

    // --- Health Level ---
    let healthLevel;
    if (stabilityScore > 75) {
        healthLevel = "Stable";
    } else if (stabilityScore >= 50) {
        healthLevel = "Watchlist";
    } else {
        healthLevel = "Critical";
    }

    return {
        financialHealthScore: stabilityScore,
        healthLevel,
        volatilityScore,
        impulseScore,
    };
};

const getFinancialStabilityIndex = async (req, res) => {
    try {
        const result = await calculateStability(req.user._id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getFinancialStabilityIndex, calculateStability };
