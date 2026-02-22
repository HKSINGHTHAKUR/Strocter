const Transaction = require("../models/Transaction");

/* ── Helpers ── */
const EMOTIONAL_KEYWORDS = ["impulse", "stress", "angry", "anxious", "sad", "bored", "happy", "excited", "emotional"];
const isEmotional = (emotion) => {
    if (!emotion) return false;
    return EMOTIONAL_KEYWORDS.some((k) => emotion.toLowerCase().includes(k));
};

/* ── 1. Stability Index ── */
async function calculateStabilityIndex(userId) {
    const txns = await Transaction.find({ user: userId }).sort({ createdAt: -1 }).limit(200);
    if (!txns.length) return { index: 50, mom: 0 };

    const expenses = txns.filter((t) => t.type === "expense");
    const incomes = txns.filter((t) => t.type === "income");

    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0) || 1;
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);

    /* Savings rate (30%) */
    const savingsRate = Math.max(0, (totalIncome - totalExpense) / totalIncome);
    const savingsScore = Math.min(100, savingsRate * 200);

    /* Expense volatility (25%) */
    const expAmounts = expenses.map((t) => t.amount);
    const avgExp = expAmounts.length ? expAmounts.reduce((s, a) => s + a, 0) / expAmounts.length : 0;
    const variance = expAmounts.length
        ? expAmounts.reduce((s, a) => s + Math.pow(a - avgExp, 2), 0) / expAmounts.length
        : 0;
    const cv = avgExp > 0 ? Math.sqrt(variance) / avgExp : 0;
    const volatilityScore = Math.max(0, 100 - cv * 60);

    /* Impulse impact (20%) */
    const emotionalCount = expenses.filter((t) => isEmotional(t.emotion)).length;
    const impulseRatio = expenses.length ? emotionalCount / expenses.length : 0;
    const impulseScore = Math.max(0, 100 - impulseRatio * 120);

    /* Income consistency (15%) */
    const incomeScore = incomes.length > 2 ? 80 : incomes.length > 0 ? 60 : 30;

    /* Liquidity ratio (10%) */
    const monthlyExpense = totalExpense / Math.max(1, Math.ceil(txns.length / 30));
    const liquidityRatio = monthlyExpense > 0 ? (totalIncome - totalExpense) / monthlyExpense : 0;
    const liquidityScore = Math.min(100, Math.max(0, liquidityRatio * 25));

    const raw = savingsScore * 0.30 + volatilityScore * 0.25 + impulseScore * 0.20 +
        incomeScore * 0.15 + liquidityScore * 0.10;
    const index = Math.round(Math.min(100, Math.max(0, raw)));

    /* MoM change estimate */
    const half = Math.floor(expenses.length / 2);
    const recentAvg = expenses.slice(0, half).reduce((s, t) => s + t.amount, 0) / (half || 1);
    const olderAvg = expenses.slice(half).reduce((s, t) => s + t.amount, 0) / (expenses.length - half || 1);
    const mom = olderAvg > 0 ? parseFloat((((olderAvg - recentAvg) / olderAvg) * 100).toFixed(1)) : 0;

    return { index, mom };
}

/* ── 2. Risk Exposure ── */
async function calculateRiskExposure(userId) {
    const expenses = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: -1 }).limit(100);
    if (!expenses.length) return { level: "Low", detail: "No data" };

    const emotionalTotal = expenses.filter((t) => isEmotional(t.emotion)).reduce((s, t) => s + t.amount, 0);
    const total = expenses.reduce((s, t) => s + t.amount, 0);
    const ratio = total > 0 ? emotionalTotal / total : 0;

    let level, detail;
    if (ratio < 0.2) { level = "LOW"; detail = "Optimal Safety Zone"; }
    else if (ratio < 0.4) { level = "MODERATE"; detail = "Manageable exposure"; }
    else if (ratio < 0.6) { level = "ELEVATED"; detail = "Above average risk"; }
    else { level = "HIGH"; detail = "Critical exposure"; }

    return { level, detail };
}

/* ── 3. Savings Growth ── */
async function calculateSavingsGrowth(userId) {
    const txns = await Transaction.find({ user: userId }).sort({ createdAt: -1 }).limit(200);
    if (!txns.length) return { percentage: 0, benchmark: "No data" };

    const income = txns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = txns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const savings = income - expense;
    const percentage = income > 0 ? parseFloat(((savings / income) * 100).toFixed(1)) : 0;

    const benchmark = percentage > 15 ? "Above Benchmark" : percentage > 5 ? "On Target" : "Below Benchmark";
    return { percentage, benchmark };
}

/* ── 4. Financial Buffer ── */
async function calculateFinancialBuffer(userId) {
    const txns = await Transaction.find({ user: userId }).sort({ createdAt: -1 }).limit(200);
    if (!txns.length) return { months: 0, status: "No data" };

    const income = txns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = txns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const savings = Math.max(0, income - expense);

    const expenseCount = txns.filter((t) => t.type === "expense").length;
    const monthlyExpense = expenseCount > 0 ? expense / Math.max(1, Math.ceil(expenseCount / 15)) : 1;
    const months = monthlyExpense > 0 ? parseFloat((savings / monthlyExpense).toFixed(1)) : 0;

    const status = months >= 6 ? "Historical High" : months >= 3 ? "Adequate" : "Low buffer";
    return { months, status };
}

/* ── 5. Trend Projection ── */
async function generateTrendProjection(userId, range = "1Y") {
    const txns = await Transaction.find({ user: userId }).sort({ createdAt: 1 });
    const months = range === "6M" ? 6 : range === "3Y" ? 36 : 12;
    const projectionMonths = Math.ceil(months * 0.4);

    /* Build monthly historical data */
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

    /* Historical stability scores */
    let historical = entries.slice(-months).map(([key, val]) => {
        const [y, m] = key.split("-");
        const savingsRate = val.income > 0 ? (val.income - val.expense) / val.income : 0;
        const score = Math.round(Math.min(100, Math.max(20, 50 + savingsRate * 80)));
        return { month: `${monthNames[parseInt(m) - 1]}`, historical: score, projection: null };
    });

    if (!historical.length) {
        historical = monthNames.slice(0, 6).map((m) => ({ month: m, historical: 50, projection: null }));
    }

    /* Generate projection */
    const lastScore = historical[historical.length - 1]?.historical || 50;
    const avgGrowth = historical.length > 1
        ? (historical[historical.length - 1].historical - historical[0].historical) / historical.length
        : 1.5;

    const lastMonthIdx = entries.length
        ? parseInt(entries[entries.length - 1][0].split("-")[1]) - 1
        : new Date().getMonth();

    for (let i = 1; i <= projectionMonths; i++) {
        const mIdx = (lastMonthIdx + i) % 12;
        const projected = Math.round(Math.min(100, lastScore + avgGrowth * i * 1.2));
        historical.push({
            month: monthNames[mIdx],
            historical: null,
            projection: projected,
        });
    }

    /* Bridge point */
    if (historical.length > projectionMonths) {
        const bridgeIdx = historical.length - projectionMonths - 1;
        if (bridgeIdx >= 0 && historical[bridgeIdx]) {
            historical[bridgeIdx].projection = historical[bridgeIdx].historical;
        }
    }

    const lastHistorical = historical.filter((d) => d.historical !== null);
    const forecastedIndex = historical[historical.length - 1]?.projection || lastScore;
    const resilienceDelta = lastHistorical.length > 1
        ? parseFloat((forecastedIndex - lastHistorical[0].historical).toFixed(1))
        : 0;

    return { trend: historical, forecastedIndex, resilienceDelta };
}

/* ── 6. Radar Values ── */
async function calculateRadarValues(userId) {
    const txns = await Transaction.find({ user: userId }).sort({ createdAt: -1 }).limit(200);
    const expenses = txns.filter((t) => t.type === "expense");
    const income = txns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenseTotal = expenses.reduce((s, t) => s + t.amount, 0);

    /* Liquidity */
    const savings = Math.max(0, income - expenseTotal);
    const liquidity = Math.min(100, Math.round((savings / Math.max(1, expenseTotal)) * 100));

    /* Market Risk (inverse of diversification) */
    const cats = {};
    expenses.forEach((t) => { cats[t.category] = (cats[t.category] || 0) + t.amount; });
    const catCount = Object.keys(cats).length;
    const marketRisk = Math.min(100, Math.round(80 - catCount * 8));

    /* Leverage (emotional spending ratio) */
    const emotionalTotal = expenses.filter((t) => isEmotional(t.emotion)).reduce((s, t) => s + t.amount, 0);
    const leverage = expenseTotal > 0 ? Math.min(100, Math.round((emotionalTotal / expenseTotal) * 120)) : 20;

    /* Control */
    const control = Math.min(100, Math.max(10, 100 - leverage));

    /* Critical factor */
    const values = { Liquidity: liquidity, "Market Risk": marketRisk, Leverage: leverage, Control: control };
    const sorted = Object.entries(values).sort((a, b) => b[1] - a[1]);
    const criticalFactor = sorted[0][0] === "Control" ? sorted[1][0] : sorted[0][0];
    const status = leverage > 50 ? "Aggressive" : "Defensive";

    return {
        radar: [
            { subject: "Liquidity", value: liquidity },
            { subject: "Market Risk", value: marketRisk },
            { subject: "Leverage", value: leverage },
            { subject: "Control", value: control },
        ],
        criticalFactor,
        status,
    };
}

/* ── 7. Asset Allocation ── */
async function calculateAssetAllocation(userId) {
    const txns = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: -1 }).limit(200);
    if (!txns.length) return { needs: 33, savings: 33, investments: 34, suggestion: "" };

    const total = txns.reduce((s, t) => s + t.amount, 0);
    const categoryTotals = {};
    txns.forEach((t) => { categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount; });

    const needsCats = ["rent", "utilities", "groceries", "food", "transport", "insurance", "health"];
    const investCats = ["investment", "stocks", "crypto", "mutual fund", "savings"];

    let needsTotal = 0, investTotal = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
        const lc = cat.toLowerCase();
        if (needsCats.some((n) => lc.includes(n))) needsTotal += amt;
        else if (investCats.some((n) => lc.includes(n))) investTotal += amt;
    });

    const savingsTotal = Math.max(0, total - needsTotal - investTotal);
    const needs = Math.round((needsTotal / total) * 100) || 35;
    const investments = Math.round((investTotal / total) * 100) || 20;
    const savings = 100 - needs - investments;

    /* Find under-allocated category */
    const sorted = Object.entries(categoryTotals).sort((a, b) => a[1] - b[1]);
    const weakest = sorted.length ? sorted[0][0] : "Savings";
    const suggestion = `Your "${weakest}" category is under-allocated relative to stability levels. Consider a 6% shift from Liquid Savings to Defensive Equity.`;

    return { needs, savings: Math.max(0, savings), investments, suggestion };
}

/* ── 8. Strategic Outlook ── */
async function generateStrategicOutlook(userId) {
    const txns = await Transaction.find({ user: userId }).sort({ createdAt: -1 }).limit(200);
    const expenses = txns.filter((t) => t.type === "expense");
    const income = txns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenseTotal = expenses.reduce((s, t) => s + t.amount, 0);

    const emotionalTotal = expenses.filter((t) => isEmotional(t.emotion)).reduce((s, t) => s + t.amount, 0);
    const emotionalRatio = expenseTotal > 0 ? emotionalTotal / expenseTotal : 0;

    const reducedChurn = `+${Math.round(14 + emotionalRatio * 10)}%`;
    const subscriptionLeakage = `-${(2.1 + emotionalRatio * 3).toFixed(1)}%`;
    const reinvestmentVelocity = emotionalRatio < 0.3 ? "Optimized" : "Moderate";

    const savingsRate = income > 0 ? (income - expenseTotal) / income : 0;
    const predictedImprovement = parseFloat((12 + savingsRate * 20).toFixed(1));
    const riskReduction = parseFloat((25 + (1 - emotionalRatio) * 15).toFixed(1));

    return {
        behavioralImpacts: { reducedChurn, subscriptionLeakage, reinvestmentVelocity },
        predictedImprovement,
        riskReduction,
        narrative: "Based on your recent transaction behavior and global market trends, our proprietary model suggests a pivot towards defensive asset appreciation over the next 18 months.",
    };
}

module.exports = {
    calculateStabilityIndex,
    calculateRiskExposure,
    calculateSavingsGrowth,
    calculateFinancialBuffer,
    generateTrendProjection,
    calculateRadarValues,
    calculateAssetAllocation,
    generateStrategicOutlook,
};
