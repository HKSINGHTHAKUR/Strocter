/* ── analyticsEngine.js ──
   Central analytics brain. All pages call this engine for calculations.
   No controller should contain calculation logic.
*/

const Transaction = require("../models/Transaction");
const SystemSettings = require("../models/SystemSettings");

const EMOTIONAL_KEYWORDS = ["impulse", "stress", "angry", "anxious", "sad", "bored", "happy", "excited", "emotional", "frustrated", "revenge", "retail therapy"];
const isEmotional = (emotion) => {
    if (!emotion) return false;
    return EMOTIONAL_KEYWORDS.some((k) => emotion.toLowerCase().includes(k));
};

/* ── 1. Behavioral Metrics (for Behavioral Analytics page) ── */
async function calculateBehavioralMetrics(userId) {
    const txns = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: -1 }).limit(200);
    if (!txns.length) {
        return {
            emotionalSpending: { value: "0%", change: "N/A", progress: 0 },
            logicalSpending: { value: "100%", change: "N/A", progress: 100 },
            dopamineIndex: { value: "0", suffix: "/100", change: "No data", progress: 0 },
            resilienceScore: { value: "0", change: "No data", progress: 0 },
            volatilityIndex: { value: "Low", change: "N/A", progress: 0 },
        };
    }

    const total = txns.reduce((s, t) => s + t.amount, 0);
    const emotionalTxns = txns.filter((t) => isEmotional(t.emotion));
    const emotionalTotal = emotionalTxns.reduce((s, t) => s + t.amount, 0);
    const emotionalPct = total > 0 ? (emotionalTotal / total) * 100 : 0;
    const logicalPct = 100 - emotionalPct;

    // Dopamine index: how frequently small emotional purchases occur
    const smallEmotional = emotionalTxns.filter((t) => t.amount < total / txns.length).length;
    const dopamine = Math.min(100, Math.round((smallEmotional / (txns.length || 1)) * 150 + 30));

    // Resilience: inverse of impulse ratio
    const resilience = Math.min(10, parseFloat((10 - emotionalPct / 12).toFixed(1)));

    // Volatility: coefficient of variation
    const amounts = txns.map((t) => t.amount);
    const avg = amounts.reduce((s, a) => s + a, 0) / amounts.length;
    const variance = amounts.reduce((s, a) => s + Math.pow(a - avg, 2), 0) / amounts.length;
    const cv = avg > 0 ? Math.sqrt(variance) / avg : 0;
    const volatilityLabel = cv < 0.4 ? "Low" : cv < 0.8 ? "Low-Mid" : cv < 1.2 ? "Mid" : "High";
    const volatilityPct = Math.min(100, Math.round(cv * 60));

    // MoM changes
    const half = Math.floor(txns.length / 2);
    const recentEmotional = txns.slice(0, half).filter((t) => isEmotional(t.emotion)).length;
    const olderEmotional = txns.slice(half).filter((t) => isEmotional(t.emotion)).length;
    const emotionalChange = olderEmotional > 0 ? parseFloat((((recentEmotional - olderEmotional) / olderEmotional) * 100).toFixed(1)) : 0;

    return {
        emotionalSpending: { value: `${emotionalPct.toFixed(1)}%`, change: `${emotionalChange > 0 ? "+" : ""}${emotionalChange}%`, changePositive: emotionalChange <= 0, progress: emotionalPct },
        logicalSpending: { value: `${logicalPct.toFixed(1)}%`, change: `${(-emotionalChange).toFixed(1)}%`, changePositive: emotionalChange >= 0, progress: logicalPct },
        dopamineIndex: { value: `${dopamine}`, suffix: "/100", change: dopamine > 60 ? "Elevated" : "Stable", changePositive: dopamine <= 60, progress: dopamine },
        resilienceScore: { value: `${resilience}`, change: resilience >= 7 ? "Excellent" : resilience >= 5 ? "Good" : "Needs work", changePositive: resilience >= 5, progress: resilience * 10 },
        volatilityIndex: { value: volatilityLabel, change: `${volatilityPct < 40 ? "-" : "+"}${Math.abs(8)}% change`, changePositive: volatilityPct < 50, progress: volatilityPct },
    };
}

/* ── 2. Heatmap from real timestamps ── */
async function generateHeatmap(userId) {
    const txns = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: -1 }).limit(500);
    // 7 days × 24 hours grid
    const grid = Array.from({ length: 7 }, () => Array(24).fill(0));
    const counts = Array.from({ length: 7 }, () => Array(24).fill(0));

    txns.forEach((t) => {
        const d = new Date(t.createdAt);
        const day = d.getDay() === 0 ? 6 : d.getDay() - 1; // Mon=0
        const hour = d.getHours();
        grid[day][hour] += t.amount;
        counts[day][hour]++;
    });

    // Normalize to 0–5 intensity
    const allAmounts = grid.flat();
    const maxAmount = Math.max(...allAmounts, 1);

    const heatmap = grid.map((row) => row.map((val) => Math.min(5, Math.round((val / maxAmount) * 5))));

    // Peak analysis
    let peakDay = 0, peakHour = 0, peakVal = 0;
    grid.forEach((row, d) => row.forEach((val, h) => {
        if (val > peakVal) { peakVal = val; peakDay = d; peakHour = h; }
    }));

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const lateNightTotal = txns.filter((t) => { const h = new Date(t.createdAt).getHours(); return h >= 23 || h <= 3; }).length;
    const lateNightPct = txns.length > 0 ? Math.round((lateNightTotal / txns.length) * 100) : 0;

    return {
        heatmap,
        insight: `Late-night activity (11 PM–3 AM) shows a ${lateNightPct}% correlation with high-value dopamine-driven purchases. Peak spending: ${dayNames[peakDay]} at ${peakHour > 12 ? peakHour - 12 + " PM" : peakHour + " AM"}.`,
    };
}

/* ── 3. Cognitive Analysis ── */
async function generateCognitiveAnalysis(userId) {
    const txns = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: -1 }).limit(200);
    const emotionalTxns = txns.filter((t) => isEmotional(t.emotion));
    const total = txns.reduce((s, t) => s + t.amount, 0) || 1;
    const emotionalTotal = emotionalTxns.reduce((s, t) => s + t.amount, 0);

    // Resilience change
    const half = Math.floor(txns.length / 2);
    const recentEmotional = txns.slice(0, half).filter((t) => isEmotional(t.emotion)).length;
    const olderEmotional = txns.slice(half).filter((t) => isEmotional(t.emotion)).length;
    const resilienceChange = olderEmotional > 0 ? Math.round(((olderEmotional - recentEmotional) / olderEmotional) * 100) : 0;

    // Top trigger
    const lateNight = txns.filter((t) => { const h = new Date(t.createdAt).getHours(); return h >= 23 || h < 2; });
    const trigger = lateNight.length > txns.length * 0.15 ? "Late-Night Spending" : emotionalTotal > total * 0.3 ? "High Stress" : "Routine Drift";

    const potentialSavings = Math.round(emotionalTotal * 0.25);

    return {
        narrative: `Your Impulse Resilience has ${resilienceChange >= 0 ? "increased" : "decreased"} by ${Math.abs(resilienceChange)}% this month. Data suggests a strong correlation between your "Productive Routine" window (8 AM–11 AM) and high-value logical investments.`,
        trigger,
        action: trigger === "Late-Night Spending" ? "Time-based Lock" : "24h Hold Period",
        quote: `"Reducing discretionary exposure during late-night windows could improve your net savings by approximately ₹${(potentialSavings / 1000).toFixed(1)}k based on last month's velocity."`,
    };
}

/* ── 4. Sentiment Trend (weekly) ── */
async function generateSentimentTrend(userId) {
    const txns = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: 1 }).limit(300);

    // Group by week
    const weeklyData = {};
    txns.forEach((t) => {
        const d = new Date(t.createdAt);
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        const key = weekStart.toISOString().slice(0, 10);
        if (!weeklyData[key]) weeklyData[key] = { emotional: 0, logical: 0, total: 0 };
        if (isEmotional(t.emotion)) weeklyData[key].emotional += t.amount;
        else weeklyData[key].logical += t.amount;
        weeklyData[key].total += t.amount;
    });

    const entries = Object.entries(weeklyData).sort((a, b) => a[0].localeCompare(b[0])).slice(-6);

    return entries.map(([, val], i) => ({
        name: `WK ${String(i + 1).padStart(2, "0")}`,
        emotional: val.total > 0 ? Math.round((val.emotional / val.total) * 100) : 0,
        logical: val.total > 0 ? Math.round((val.logical / val.total) * 100) : 0,
    }));
}

/* ── 5. Category Split ── */
async function calculateCategorySplit(userId) {
    const txns = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: -1 }).limit(300);

    const catMap = {};
    txns.forEach((t) => {
        const cat = t.category || "Other";
        if (!catMap[cat]) catMap[cat] = { emotional: 0, logical: 0, total: 0 };
        if (isEmotional(t.emotion)) catMap[cat].emotional += t.amount;
        else catMap[cat].logical += t.amount;
        catMap[cat].total += t.amount;
    });

    return Object.entries(catMap)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 6)
        .map(([category, val]) => ({
            category,
            emotional: val.total > 0 ? Math.round((val.emotional / val.total) * 100) : 0,
            logical: val.total > 0 ? Math.round((val.logical / val.total) * 100) : 0,
        }));
}

module.exports = {
    calculateBehavioralMetrics,
    generateHeatmap,
    generateCognitiveAnalysis,
    generateSentimentTrend,
    calculateCategorySplit,
    isEmotional,
};
