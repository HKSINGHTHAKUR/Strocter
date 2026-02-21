const Transaction = require("../models/Transaction");

const calculatePersonality = async (userId) => {
    // Fetch last 14 days of transactions
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
            personality: "Balanced Spender",
            insight: "Not enough transaction data to analyze your behaviour.",
            totalTransactions: 0,
        };
    }

    // --- Behaviour Analysis ---

    let weekendSpending = 0;
    let weekdaySpending = 0;
    let nightTransactionCount = 0;
    let smallTransactionCount = 0;

    for (const txn of transactions) {
        const date = new Date(txn.createdAt);
        const day = date.getDay(); // 0 = Sunday, 6 = Saturday
        const hour = date.getHours();

        // a) Weekend vs Weekday spending
        if (day === 0 || day === 6) {
            weekendSpending += txn.amount;
        } else {
            weekdaySpending += txn.amount;
        }

        // b) Night spending (10PM - 5AM)
        if (hour >= 22 || hour < 5) {
            nightTransactionCount++;
        }

        // c) Frequent small transactions (amount < 200)
        if (txn.amount < 200) {
            smallTransactionCount++;
        }
    }

    // --- Personality Classification ---

    let personality = "Balanced Spender";
    let insight = "Your spending habits look balanced. Keep it up!";

    // Weekend Splurger: weekend spending > weekday spending
    if (weekendSpending > weekdaySpending) {
        personality = "Weekend Splurger";
        insight = "You tend to spend significantly more on weekends. Consider setting a weekend budget.";
    }

    // Stress Spender: more than 30% of transactions happen at night
    if (nightTransactionCount / totalTransactions > 0.3) {
        personality = "Stress Spender";
        insight = "A large portion of your spending happens late at night. This could indicate stress spending.";
    }

    // Impulsive Spender: more than 50% are small transactions
    if (smallTransactionCount / totalTransactions > 0.5) {
        personality = "Impulsive Spender";
        insight = "You make a lot of small, frequent purchases. Try batching your spending to save more.";
    }

    return {
        personality,
        insight,
        totalTransactions,
    };
};

const getFinancialPersonality = async (req, res) => {
    try {
        const result = await calculatePersonality(req.user._id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getFinancialPersonality, calculatePersonality };
