const Transaction = require("../models/Transaction");

const calculateCategoryPatterns = async (userId) => {
    // Fetch expense transactions from last 14 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const transactions = await Transaction.find({
        user: userId,
        type: "expense",
        createdAt: { $gte: fourteenDaysAgo },
    });

    // Split into current week (last 7 days) and previous week (7–14 days ago)
    const currentWeekTxns = transactions.filter(
        (txn) => new Date(txn.createdAt) >= sevenDaysAgo
    );
    const previousWeekTxns = transactions.filter(
        (txn) => new Date(txn.createdAt) < sevenDaysAgo
    );

    // Group transactions by category for both weeks
    const groupByCategory = (txns) => {
        const map = {};
        for (const txn of txns) {
            const cat = txn.category || "Uncategorized";
            map[cat] = (map[cat] || 0) + txn.amount;
        }
        return map;
    };

    const currentWeekMap = groupByCategory(currentWeekTxns);
    const previousWeekMap = groupByCategory(previousWeekTxns);

    // Collect all unique categories from both weeks
    const allCategories = new Set([
        ...Object.keys(currentWeekMap),
        ...Object.keys(previousWeekMap),
    ]);

    // Build result array
    const patterns = [];

    for (const category of allCategories) {
        const currentWeekTotal = currentWeekMap[category] || 0;
        const previousWeekTotal = previousWeekMap[category] || 0;

        let percentageChange;
        let trend;

        if (previousWeekTotal === 0) {
            percentageChange = "New Spending";
            trend = "new";
        } else {
            percentageChange =
                ((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100;
            trend = percentageChange >= 0 ? "increase" : "decrease";
            percentageChange = Math.round(percentageChange * 100) / 100; // round to 2 decimals
        }

        patterns.push({
            category,
            previousWeek: previousWeekTotal,
            currentWeek: currentWeekTotal,
            percentageChange,
            trend,
        });
    }

    return patterns;
};

const getCategoryPatterns = async (req, res) => {
    try {
        const result = await calculateCategoryPatterns(req.user._id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getCategoryPatterns, calculateCategoryPatterns };
