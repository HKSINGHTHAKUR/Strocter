const Transaction = require("../models/Transaction");

const getPremiumInsights = async (req, res) => {
    try {
        const userId = req.user._id;

        const now = new Date();

        // Last 7 days window
        const thisWeekStart = new Date(now);
        thisWeekStart.setDate(thisWeekStart.getDate() - 7);

        // Previous 7 days window
        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(lastWeekStart.getDate() - 7);

        // Fetch this week's expense transactions grouped by category
        const thisWeekData = await Transaction.aggregate([
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

        // Fetch last week's expense transactions grouped by category
        const lastWeekData = await Transaction.aggregate([
            {
                $match: {
                    user: userId,
                    type: "expense",
                    createdAt: { $gte: lastWeekStart, $lt: thisWeekStart },
                },
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" },
                },
            },
        ]);

        // Build a map of last week's spending by category
        const lastWeekMap = {};
        for (const item of lastWeekData) {
            lastWeekMap[item._id] = item.total;
        }

        // Compare and detect overspending (>30% increase)
        const overspending = [];

        for (const item of thisWeekData) {
            const category = item._id;
            const thisWeekTotal = item.total;
            const lastWeekTotal = lastWeekMap[category];

            // Only compare if there was spending last week too
            if (lastWeekTotal && lastWeekTotal > 0) {
                const increasePercent =
                    ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;

                if (increasePercent > 30) {
                    overspending.push({
                        category,
                        increasePercent: Math.round(increasePercent),
                        message: `You spent ${Math.round(increasePercent)}% more on ${category} this week compared to last week.`,
                    });
                }
            }
        }

        return res.status(200).json({ overspending });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getPremiumInsights };
