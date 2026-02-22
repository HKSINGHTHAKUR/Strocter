const Transaction = require("../models/Transaction");

/* ── Date range helper ── */
function getRangeDate(range) {
    const now = new Date();
    if (range === "7d") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (range === "30d") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return new Date(now.getTime() - 24 * 60 * 60 * 1000); // default 24h
}

/* ── Emotion classification ── */
const EMOTIONAL_KEYWORDS = ["impulse", "stress", "angry", "anxious", "sad", "bored", "happy", "excited", "emotional"];
const isEmotional = (emotion) => {
    if (!emotion) return false;
    return EMOTIONAL_KEYWORDS.some((k) => emotion.toLowerCase().includes(k));
};

/* ── 1. Calculate Impulse Score ── */
async function calculateImpulseScore(userId) {
    const txns = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: -1 }).limit(100);
    if (!txns.length) return { score: 0, baseline: 0 };

    const avg = txns.reduce((s, t) => s + t.amount, 0) / txns.length;
    const spikes = txns.filter((t) => t.amount > avg * 1.4);
    const emotionalCount = txns.filter((t) => isEmotional(t.emotion)).length;

    const spikeRatio = spikes.length / txns.length;
    const emotionalRatio = emotionalCount / txns.length;

    const raw = (spikeRatio * 50 + emotionalRatio * 50);
    const score = Math.round(Math.min(100, Math.max(0, raw)));

    const olderTxns = txns.slice(Math.floor(txns.length / 2));
    const olderAvg = olderTxns.length
        ? olderTxns.reduce((s, t) => s + t.amount, 0) / olderTxns.length
        : avg;
    const baseline = avg > 0 ? (((avg - olderAvg) / olderAvg) * 100).toFixed(1) : 0;

    return { score, baseline: parseFloat(baseline) };
}

/* ── 2. Stress Correlation ── */
async function calculateStressCorrelation(userId) {
    const txns = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: -1 }).limit(100);
    if (!txns.length) return { percentage: 0, vsAverage: 0 };

    const emotionalTxns = txns.filter((t) => isEmotional(t.emotion));
    const emotionalTotal = emotionalTxns.reduce((s, t) => s + t.amount, 0);
    const total = txns.reduce((s, t) => s + t.amount, 0);

    const percentage = total > 0 ? parseFloat(((emotionalTotal / total) * 100).toFixed(1)) : 0;
    const vsAverage = parseFloat((percentage - 50).toFixed(1));

    return { percentage, vsAverage };
}

/* ── 3. Late Night Window ── */
async function detectLateNightWindow(userId) {
    const txns = await Transaction.find({ user: userId, type: "expense" });
    if (!txns.length) return { window: "N/A", status: "No data" };

    const lateNight = txns.filter((t) => {
        const hour = new Date(t.createdAt).getHours();
        return hour >= 22 || hour <= 4;
    });

    if (!lateNight.length) return { window: "None", status: "No late-night activity" };

    const hours = lateNight.map((t) => new Date(t.createdAt).getHours());
    const minH = Math.min(...hours.map((h) => (h >= 22 ? h : h + 24)));
    const maxH = Math.max(...hours.map((h) => (h >= 22 ? h : h + 24)));

    const formatH = (h) => {
        const normalized = h >= 24 ? h - 24 : h;
        const suffix = normalized >= 12 ? "PM" : "AM";
        const display = normalized === 0 ? 12 : normalized > 12 ? normalized - 12 : normalized;
        return `${String(display).padStart(2, "0")}:${String(Math.floor(Math.random() * 59)).padStart(2, "0")}`;
    };

    const lnTotal = lateNight.reduce((s, t) => s + t.amount, 0);
    const allTotal = txns.reduce((s, t) => s + t.amount, 0);
    const lnPct = ((lnTotal / allTotal) * 100).toFixed(0);

    return {
        window: `${formatH(minH)} - ${formatH(maxH)}`,
        status: lnTotal > allTotal * 0.15 ? "CRITICAL WINDOW" : "Monitored",
        percentage: parseFloat(lnPct),
    };
}

/* ── 4. Volatility ── */
async function calculateVolatility(userId) {
    const txns = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: -1 }).limit(50);
    if (txns.length < 2) return { level: "Low", trend: "Stable pattern" };

    const amounts = txns.map((t) => t.amount);
    const avg = amounts.reduce((s, a) => s + a, 0) / amounts.length;
    const variance = amounts.reduce((s, a) => s + Math.pow(a - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    const cv = avg > 0 ? stdDev / avg : 0;

    let level, trend;
    if (cv < 0.3) { level = "Low"; trend = "Stable pattern"; }
    else if (cv < 0.6) { level = "Low-Med"; trend = "Stable pattern"; }
    else if (cv < 1.0) { level = "Medium"; trend = "Moderate fluctuation"; }
    else { level = "High"; trend = "High fluctuation"; }

    return { level, trend, cv: parseFloat(cv.toFixed(2)) };
}

/* ── 5. Detect Spikes (Timeline) ── */
async function detectSpikes(userId, range = "24h") {
    const since = getRangeDate(range);
    const txns = await Transaction.find({
        user: userId,
        type: "expense",
        createdAt: { $gte: since },
    }).sort({ createdAt: 1 });

    if (!txns.length) return [];

    const avg = txns.reduce((s, t) => s + t.amount, 0) / txns.length;
    const threshold = avg * 1.4;

    /* Build hourly buckets */
    const buckets = {};
    const allHours = range === "24h" ? 24 : range === "7d" ? 7 * 24 : 30 * 24;

    for (let i = 0; i < Math.min(allHours, 168); i++) {
        const d = new Date(since.getTime() + i * 60 * 60 * 1000);
        let label;
        if (range === "24h") label = `${String(d.getHours()).padStart(2, "0")}:00`;
        else if (range === "7d") label = `${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]} ${String(d.getHours()).padStart(2, "0")}h`;
        else label = `${d.getMonth() + 1}/${d.getDate()}`;

        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
        if (!buckets[key]) buckets[key] = { time: label, impulseSpikes: 0, stressMarkers: 0 };
    }

    txns.forEach((t) => {
        const d = new Date(t.createdAt);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
        if (!buckets[key]) {
            let label;
            if (range === "24h") label = `${String(d.getHours()).padStart(2, "0")}:00`;
            else if (range === "7d") label = `${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]} ${String(d.getHours()).padStart(2, "0")}h`;
            else label = `${d.getMonth() + 1}/${d.getDate()}`;
            buckets[key] = { time: label, impulseSpikes: 0, stressMarkers: 0 };
        }
        buckets[key].impulseSpikes += t.amount;
        if (isEmotional(t.emotion)) {
            buckets[key].stressMarkers += t.amount * 0.6;
        }
    });

    /* Mark spikes */
    const timeline = Object.values(buckets).map((b) => ({
        ...b,
        impulseSpikes: Math.round(b.impulseSpikes),
        stressMarkers: Math.round(b.stressMarkers),
        isSpike: b.impulseSpikes > threshold,
    }));

    return timeline;
}

/* ── 6. Run Simulation ── */
async function runSimulation(userId, frictionValue = 65) {
    const txns = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: -1 }).limit(100);
    if (!txns.length) {
        return { predictedSavings: 0, riskReduction: 0, stabilityForecast: 50 };
    }

    const total = txns.reduce((s, t) => s + t.amount, 0);
    const avg = total / txns.length;
    const emotionalTxns = txns.filter((t) => isEmotional(t.emotion));
    const emotionalTotal = emotionalTxns.reduce((s, t) => s + t.amount, 0);

    const frictionFactor = frictionValue / 100;
    const predictedSavings = Math.round(emotionalTotal * frictionFactor * 0.6);
    const riskReduction = Math.round(frictionFactor * 55);

    const amounts = txns.map((t) => t.amount);
    const variance = amounts.reduce((s, a) => s + Math.pow(a - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    const cv = avg > 0 ? stdDev / avg : 0;
    const baseStability = Math.max(20, 100 - cv * 40);
    const stabilityForecast = Math.round(Math.min(100, baseStability + frictionFactor * 15));

    return { predictedSavings, riskReduction, stabilityForecast };
}

/* ── 7. Get top trigger category ── */
async function getTopTriggerCategory(userId) {
    const result = await Transaction.aggregate([
        { $match: { user: userId, type: "expense" } },
        { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 1 },
    ]);
    if (!result.length) return { category: "N/A", detail: "No data" };
    return { category: result[0]._id, detail: `${result[0].count} transactions` };
}

/* ── 8. Peak vulnerability hour ── */
async function getPeakVulnerability(userId) {
    const result = await Transaction.aggregate([
        { $match: { user: userId, type: "expense" } },
        { $group: { _id: { $hour: "$createdAt" }, total: { $sum: "$amount" } } },
        { $sort: { total: -1 } },
        { $limit: 1 },
    ]);
    if (!result.length) return { time: "N/A", context: "No data" };
    const hour = result[0]._id;
    const suffix = hour >= 12 ? "PM" : "AM";
    const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const context = hour >= 22 || hour <= 5 ? "Circadian Fatigue Low" : hour >= 12 && hour <= 14 ? "Post-lunch dip" : "Active hours";
    return { time: `${String(display).padStart(2, "0")}:${String(Math.floor(Math.random() * 59)).padStart(2, "0")} ${suffix}`, context };
}

/* ── 9. Emotional pattern ── */
async function getEmotionalPattern(userId) {
    const txns = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: -1 }).limit(50);
    const emotions = txns.map((t) => t.emotion).filter(Boolean);
    if (!emotions.length) return { pattern: "Neutral", correlation: "Insufficient data" };

    const counts = {};
    emotions.forEach((e) => { counts[e] = (counts[e] || 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return { pattern: top[0], correlation: `${Math.round((top[1] / emotions.length) * 100)}% correlation` };
}

/* ── 10. Intensity index ── */
async function getIntensityIndex(userId) {
    const txns = await Transaction.find({ user: userId, type: "expense" }).sort({ createdAt: -1 }).limit(50);
    if (!txns.length) return { level: "Low", avgPerEvent: 0 };

    const avg = txns.reduce((s, t) => s + t.amount, 0) / txns.length;
    let level;
    if (avg > 500) level = "High Velocity";
    else if (avg > 200) level = "Medium Velocity";
    else level = "Low Velocity";

    return { level, avgPerEvent: parseFloat(avg.toFixed(2)) };
}

module.exports = {
    calculateImpulseScore,
    calculateStressCorrelation,
    detectLateNightWindow,
    calculateVolatility,
    detectSpikes,
    runSimulation,
    getTopTriggerCategory,
    getPeakVulnerability,
    getEmotionalPattern,
    getIntensityIndex,
};
