const Transaction = require("../models/Transaction");

const calculateRisk = async (userId) => {
    // Last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await Transaction.find({
        user: userId,
        type: "expense",
        createdAt: { $gte: thirtyDaysAgo },
    });

    if (transactions.length === 0) {
        return {
            totalSpending: 0,
            avgDailySpending: 0,
            highestExpense: 0,
            volatilityScore: 0,
            riskLevel: "Low",
        };
    }

    let totalSpending = 0;
    let highestExpense = 0;
    const spendingDays = new Set();

    for (const txn of transactions) {
        totalSpending += txn.amount;

        if (txn.amount > highestExpense) {
            highestExpense = txn.amount;
        }

        const dateKey = new Date(txn.createdAt).toISOString().split("T")[0];
        spendingDays.add(dateKey);
    }

    // Average daily spending over fixed 30-day window
    const avgDailySpending = parseFloat((totalSpending / 30).toFixed(2));

    // Spending volatility
    const volatilityScore = parseFloat(
        (highestExpense / avgDailySpending).toFixed(2)
    );

    // Map to risk level
    let riskLevel = "Low";
    if (volatilityScore > 4) {
        riskLevel = "High";
    } else if (volatilityScore >= 2) {
        riskLevel = "Medium";
    }

    return {
        totalSpending,
        avgDailySpending,
        highestExpense,
        volatilityScore,
        riskLevel,
    };
};

const getFinancialRiskScore = async (req, res) => {
    try {
        const result = await calculateRisk(req.user._id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getFinancialRiskScore, calculateRisk };
