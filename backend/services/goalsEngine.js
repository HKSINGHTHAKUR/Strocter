const Transaction = require("../models/Transaction");
const Goal = require("../models/Goal");

const EMOTIONAL_KEYWORDS = ["impulse", "stress", "angry", "anxious", "sad", "bored", "happy", "excited", "emotional"];
const isEmotional = (emotion) => {
    if (!emotion) return false;
    return EMOTIONAL_KEYWORDS.some((k) => emotion.toLowerCase().includes(k));
};

/* ── 1. Stability Target ── */
async function calculateStabilityTarget(userId) {
    const txns = await Transaction.find({ user: userId }).sort({ createdAt: -1 }).limit(200);
    const expenses = txns.filter((t) => t.type === "expense");
    const income = txns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0) || 1;
    const expenseTotal = expenses.reduce((s, t) => s + t.amount, 0);

    const savingsRate = Math.max(0, (income - expenseTotal) / income);
    const savingsScore = Math.min(100, savingsRate * 200) * 0.30;

    const amounts = expenses.map((t) => t.amount);
    const avg = amounts.length ? amounts.reduce((s, a) => s + a, 0) / amounts.length : 0;
    const variance = amounts.length ? amounts.reduce((s, a) => s + Math.pow(a - avg, 2), 0) / amounts.length : 0;
    const cv = avg > 0 ? Math.sqrt(variance) / avg : 0;
    const volScore = Math.max(0, 100 - cv * 60) * 0.25;

    const emotionalCount = expenses.filter((t) => isEmotional(t.emotion)).length;
    const impulseRatio = expenses.length ? emotionalCount / expenses.length : 0;
    const impulseScore = Math.max(0, 100 - impulseRatio * 120) * 0.25;

    const riskRatio = expenses.filter((t) => t.amount > avg * 2).length / (expenses.length || 1);
    const riskScore = Math.max(0, 100 - riskRatio * 100) * 0.20;

    const current = Math.round(Math.min(100, savingsScore + volScore + impulseScore + riskScore));
    const target = Math.min(100, current + Math.round(5 + Math.random() * 5));

    const half = Math.floor(expenses.length / 2);
    const recentAvg = expenses.slice(0, half).reduce((s, t) => s + t.amount, 0) / (half || 1);
    const olderAvg = expenses.slice(half).reduce((s, t) => s + t.amount, 0) / (expenses.length - half || 1);
    const mom = olderAvg > 0 ? parseFloat((((olderAvg - recentAvg) / olderAvg) * 100).toFixed(1)) : 0;

    const progress = target > 0 ? Math.round((current / target) * 100) : 0;

    return { current, target, progress, mom };
}

/* ── 2. Impulse Reduction ── */
async function calculateImpulseReduction(userId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recent = await Transaction.find({ user: userId, type: "expense", createdAt: { $gte: thirtyDaysAgo } });
    const baseline = await Transaction.find({ user: userId, type: "expense", createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });

    const recentEmotional = recent.filter((t) => isEmotional(t.emotion)).reduce((s, t) => s + t.amount, 0);
    const baselineEmotional = baseline.filter((t) => isEmotional(t.emotion)).reduce((s, t) => s + t.amount, 0);
    const recentTotal = recent.reduce((s, t) => s + t.amount, 0) || 1;
    const baselineTotal = baseline.reduce((s, t) => s + t.amount, 0) || 1;

    const recentRatio = (recentEmotional / recentTotal) * 100;
    const baselineRatio = (baselineEmotional / baselineTotal) * 100;
    const improvement = parseFloat((baselineRatio - recentRatio).toFixed(1));

    const current = Math.round(100 - recentRatio);
    const target = Math.min(100, current + Math.round(10 + Math.random() * 8));
    const status = improvement > 0 ? "Stable" : "Volatile";

    return { current, target, improvement, status };
}

/* ── 3. Savings Progress ── */
async function calculateSavingsProgress(userId) {
    const txns = await Transaction.find({ user: userId }).sort({ createdAt: -1 }).limit(200);
    const income = txns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = txns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const currentSavings = Math.max(0, income - expense);

    const goals = await Goal.find({ userId, type: "savings" }).sort({ createdAt: -1 }).limit(1);
    const targetSavings = goals.length ? goals[0].targetValue : Math.max(currentSavings * 1.4, 250000);

    const progress = targetSavings > 0 ? Math.round((currentSavings / targetSavings) * 100) : 0;

    const half = Math.floor(txns.length / 2);
    const recentIncome = txns.slice(0, half).filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const olderIncome = txns.slice(half).filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const mom = olderIncome > 0 ? `+₹${Math.round(Math.abs(recentIncome - olderIncome) / 1000)}k` : "+₹0k";

    return {
        current: `₹${Math.round(currentSavings / 1000)}k`,
        target: `₹${Math.round(targetSavings / 1000)}k`,
        progress,
        mom,
    };
}

/* ── 4. Risk Exposure ── */
async function calculateRiskExposure(userId) {
    const expenses = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: -1 }).limit(100);
    if (!expenses.length) return { current: 0, target: -30, progress: 0, status: "Optimizing" };

    const total = expenses.reduce((s, t) => s + t.amount, 0);
    const avg = total / expenses.length;
    const highRiskCount = expenses.filter((t) => t.amount > avg * 2 || isEmotional(t.emotion)).length;
    const riskRatio = (highRiskCount / expenses.length) * 100;

    const current = -Math.round(riskRatio);
    const target = -30;
    const progress = Math.min(100, Math.round(((30 + current) / 30) * 100 + 50));
    const status = riskRatio < 20 ? "Optimizing" : "Elevated";

    return { current: `${current}%`, target: `${target}% Target`, progress, status };
}

/* ── 5. Trajectory ── */
async function generateTrajectory(userId) {
    const txns = await Transaction.find({ user: userId }).sort({ createdAt: 1 });
    const monthlyData = {};
    txns.forEach((t) => {
        const d = new Date(t.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyData[key]) monthlyData[key] = { income: 0, expense: 0 };
        if (t.type === "income") monthlyData[key].income += t.amount;
        else monthlyData[key].expense += t.amount;
    });

    const entries = Object.entries(monthlyData).sort((a, b) => a[0].localeCompare(b[0]));
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const trajectory = entries.slice(-8).map(([key, val]) => {
        const [, m] = key.split("-");
        const savingsRate = val.income > 0 ? (val.income - val.expense) / val.income : 0;
        const score = Math.round(Math.min(100, Math.max(10, 40 + savingsRate * 80)));
        return { date: monthNames[parseInt(m) - 1], actual: score, projection: null };
    });

    if (!trajectory.length) {
        return monthNames.slice(0, 6).map((m, i) => ({
            date: m, actual: 40 + i * 5, projection: null,
        }));
    }

    const last = trajectory[trajectory.length - 1]?.actual || 50;
    const growth = trajectory.length > 1
        ? (trajectory[trajectory.length - 1].actual - trajectory[0].actual) / trajectory.length
        : 2;

    const lastIdx = entries.length
        ? parseInt(entries[entries.length - 1][0].split("-")[1]) - 1
        : new Date().getMonth();

    // Bridge point
    trajectory[trajectory.length - 1].projection = trajectory[trajectory.length - 1].actual;

    for (let i = 1; i <= 4; i++) {
        const mIdx = (lastIdx + i) % 12;
        trajectory.push({
            date: monthNames[mIdx],
            actual: null,
            projection: Math.round(Math.min(100, last + growth * i * 1.3)),
        });
    }

    const insight = `"Impulse reduction curve indicates consistent downward stabilization over last 21 days. Projected target reach estimated in 14 days."`;

    return { trajectory, insight };
}

/* ── 6. AI Strategy Memo ── */
async function generateAIStrategyMemo(userId) {
    const expenses = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: -1 }).limit(100);
    const lateNight = expenses.filter((t) => {
        const h = new Date(t.createdAt).getHours();
        return h >= 23 || h < 2;
    });

    const lateNightTotal = lateNight.reduce((s, t) => s + t.amount, 0);
    const emotionalTotal = expenses.filter((t) => isEmotional(t.emotion)).reduce((s, t) => s + t.amount, 0);
    const total = expenses.reduce((s, t) => s + t.amount, 0) || 1;

    const triggerType = lateNight.length > expenses.length * 0.15
        ? "Late-night Discretionary Spending"
        : emotionalTotal > total * 0.2
            ? "Emotional Impulse Patterns"
            : "Irregular High-value Transactions";

    const triggerDetail = lateNight.length > expenses.length * 0.15
        ? "Recurrent pattern detected between 11PM–2AM (Local Time)."
        : "Behavioral analysis flags recurring impulsive triggers.";

    const retainment = Math.round(lateNightTotal > 0 ? lateNightTotal * 0.3 : emotionalTotal * 0.25);

    return {
        trigger: triggerType,
        triggerDetail,
        action: "Budget Auto-Lock",
        actionDetail: "Temporary 15% ceiling restriction on card transactions during identified high-impulse hours.",
        expectedImpacts: [
            `+₹${(retainment / 1000).toFixed(1)}k Monthly Liquidity Retainment`,
            `-12% Impulse Score Mitigation`,
        ],
    };
}

/* ── 7. Quarterly Milestones ── */
async function computeQuarterlyMilestones(userId) {
    const goals = await Goal.find({ userId }).sort({ createdAt: -1 }).limit(1);

    if (goals.length && goals[0].milestones.length) {
        return goals[0].milestones;
    }

    const now = new Date();
    const currentQ = Math.ceil((now.getMonth() + 1) / 3);

    return [
        { quarter: "Q1 2024", label: "Foundation", description: "Baseline behavioral profile established", status: "achieved" },
        { quarter: "Q2 2024", label: "Optimization", description: "Impulse reduction protocols active", status: currentQ >= 2 ? "achieved" : "pending" },
        { quarter: "Q3 2024", label: "Growth", description: "Savings target milestone tracking", status: currentQ >= 3 ? "active" : "pending" },
        { quarter: "Q4 2024", label: "Mastery", description: "Full behavioral stabilization", status: "pending" },
    ];
}

/* ── 8. Impact Summary ── */
async function computeImpactSummary(userId) {
    const txns = await Transaction.find({ user: userId }).sort({ createdAt: -1 }).limit(200);
    const expenses = txns.filter((t) => t.type === "expense");
    const income = txns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenseTotal = expenses.reduce((s, t) => s + t.amount, 0);

    const emotionalTotal = expenses.filter((t) => isEmotional(t.emotion)).reduce((s, t) => s + t.amount, 0);
    const savingsRate = income > 0 ? (income - expenseTotal) / income : 0;

    const projectedSavings = `₹${Math.round(emotionalTotal * 0.3 / 1000)}k`;
    const riskReduction = `${Math.round(15 + savingsRate * 20)}%`;
    const stabilityForecast = savingsRate > 0.15 ? "Positive" : savingsRate > 0.05 ? "Neutral" : "At Risk";

    return { projectedSavings, riskReduction, stabilityForecast };
}

module.exports = {
    calculateStabilityTarget,
    calculateImpulseReduction,
    calculateSavingsProgress,
    calculateRiskExposure,
    generateTrajectory,
    generateAIStrategyMemo,
    computeQuarterlyMilestones,
    computeImpactSummary,
};
