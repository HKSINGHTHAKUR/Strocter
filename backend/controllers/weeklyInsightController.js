const Transaction = require("../models/Transaction");

const calculateWeeklySummary = async (userId) => {
    const now = new Date();

    // Current week: last 7 days
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);

    // Previous week: 7 days before that
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    // Fetch current week expenses
    const currentWeekTxns = await Transaction.aggregate([
        {
            $match: {
                user: userId,
                type: "expense",
                createdAt: { $gte: thisWeekStart, $lte: now },
            },
        },
        {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" },
            },
        },
    ]);

    // Fetch previous week expenses
    const previousWeekTxns = await Transaction.aggregate([
        {
            $match: {
                user: userId,
                type: "expense",
                createdAt: { $gte: lastWeekStart, $lt: thisWeekStart },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$amount" },
            },
        },
    ]);

    // Calculate totals
    const thisWeek = currentWeekTxns.reduce((sum, item) => sum + item.total, 0);
    const lastWeek = previousWeekTxns.length > 0 ? previousWeekTxns[0].total : 0;

    // Find highest spending category this week
    let topCategory = "N/A";
    let maxAmount = 0;

    for (const item of currentWeekTxns) {
        if (item.total > maxAmount) {
            maxAmount = item.total;
            topCategory = item._id;
        }
    }

    // Calculate change percentage (handle divide-by-zero)
    let changePercentage = 0;
    if (lastWeek > 0) {
        changePercentage = Math.round(
            ((thisWeek - lastWeek) / lastWeek) * 100
        );
    } else if (thisWeek > 0) {
        changePercentage = 100;
    }

    // Determine trend and generate summary
    const trend = thisWeek >= lastWeek ? "increase" : "decrease";

    let summary;
    if (trend === "increase") {
        summary = `Your spending increased this week compared to last week. Most of your spending was on ${topCategory}. Try to control discretionary expenses.`;
    } else {
        summary = "Great! Your spending has reduced this week. You're building better financial habits.";
    }

    return {
        thisWeek,
        lastWeek,
        changePercentage,
        topCategory,
        trend,
        summary,
    };
};

const getWeeklyInsightSummary = async (req, res) => {
    try {
        const result = await calculateWeeklySummary(req.user._id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getWeeklyInsightSummary, calculateWeeklySummary };
