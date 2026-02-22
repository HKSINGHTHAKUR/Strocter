const Transaction = require("../models/Transaction");

/* ── Helpers (shared with intelligenceFeedController) ── */

const EMOTIONAL_EMOTIONS = [
    "stressed", "impulsive", "sad", "excited", "anxious", "bored", "happy",
];

const getIntent = (category, emotion) => {
    const cat = (category || "").toLowerCase();
    const emo = (emotion || "").toLowerCase();

    if (["stressed", "impulsive"].includes(emo)) return "STRESS IMPULSE";
    if (["sad", "anxious", "bored"].includes(emo)) return "EMOTIONAL/SOCIAL";
    if (["investment", "savings", "mutual fund"].includes(cat)) return "INVESTMENT";
    if (["entertainment", "shopping"].includes(cat) || emo === "excited")
        return "EMOTIONAL/SOCIAL";
    return "LOGICAL/ROUTINE";
};

const getImpactScore = (category, emotion, amount) => {
    const emo = (emotion || "").toLowerCase();
    if (["impulsive", "stressed"].includes(emo) && amount > 100) return { score: 85, label: "High Risk" };
    if (amount > 500) return { score: 75, label: "High Risk" };
    if (amount > 200) return { score: 50, label: "Moderate" };
    if (amount > 50) return { score: 30, label: "Neutral" };
    return { score: 15, label: "Optimal" };
};

/* ── Add Transaction ── */

exports.addTransaction = async (req, res) => {
    try {
        const { amount, type, category, note, emotion, tags, createdAt } = req.body;

        const newTransaction = await Transaction.create({
            user: req.user,
            amount,
            type,
            category,
            note,
            emotion,
            tags,
            ...(createdAt && { createdAt: new Date(createdAt) }),
        });

        res.status(201).json({
            success: true,
            data: newTransaction,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ── Transaction Metrics ── */

exports.getTransactionMetrics = async (req, res) => {
    try {
        const userId = req.user._id;
        const transactions = await Transaction.find({ user: userId }).lean();
        const total = transactions.length;

        if (total === 0) {
            return res.status(200).json({
                totalTransactions: 0,
                changePercent: 0,
                logicalPercent: 0,
                emotionalPercent: 0,
                highRiskSpending: 0,
                volatility: "Low",
                volatilityLabel: "STABLE",
            });
        }

        // Logical vs emotional split
        let emotionalCount = 0;
        let highRiskTotal = 0;
        const now = new Date();
        const oneWeekAgo = new Date(now - 7 * 86400000);
        const twoWeeksAgo = new Date(now - 14 * 86400000);
        let thisWeekCount = 0;
        let lastWeekCount = 0;

        transactions.forEach((txn) => {
            const emo = (txn.emotion || "").toLowerCase();
            if (EMOTIONAL_EMOTIONS.includes(emo)) emotionalCount++;

            // High risk = impulsive/stressed + high amount
            if (
                (["impulsive", "stressed"].includes(emo) && txn.amount > 100) ||
                txn.amount > 500
            ) {
                highRiskTotal += txn.amount;
            }

            const txnDate = new Date(txn.createdAt);
            if (txnDate >= oneWeekAgo) thisWeekCount++;
            else if (txnDate >= twoWeeksAgo) lastWeekCount++;
        });

        const logicalPercent = Math.round(((total - emotionalCount) / total) * 100);
        const emotionalPercent = 100 - logicalPercent;
        const changePercent =
            lastWeekCount > 0
                ? +(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100).toFixed(1)
                : 0;

        // Volatility based on impulse ratio
        const impulseRatio = emotionalCount / total;
        let volatility = "Low";
        let volatilityLabel = "STABLE";
        if (impulseRatio > 0.5) {
            volatility = "High";
            volatilityLabel = "VOLATILE";
        } else if (impulseRatio > 0.25) {
            volatility = "Moderate";
            volatilityLabel = "CAUTION";
        }

        return res.status(200).json({
            totalTransactions: total,
            changePercent,
            logicalPercent,
            emotionalPercent,
            highRiskSpending: highRiskTotal,
            volatility,
            volatilityLabel,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* ── Transaction History (paginated) ── */

exports.getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const [transactions, totalCount] = await Promise.all([
            Transaction.find({ user: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Transaction.countDocuments({ user: userId }),
        ]);

        const history = transactions.map((txn) => {
            const intent = getIntent(txn.category, txn.emotion);
            const impact = getImpactScore(txn.category, txn.emotion, txn.amount);

            return {
                id: txn._id,
                date: txn.createdAt,
                merchant: txn.note || txn.category,
                category: txn.category,
                psychologicalIntent: intent,
                impactScore: impact.score,
                impactLabel: impact.label,
                value: txn.amount,
                type: txn.type,
                emotion: txn.emotion,
            };
        });

        return res.status(200).json({
            history,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
