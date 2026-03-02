import { useEffect, useState, useRef } from "react";

/* ── Animated counter ── */
function AnimatedNumber({ value, suffix = "" }) {
    const [display, setDisplay] = useState(0);
    const prev = useRef(0);

    useEffect(() => {
        const start = prev.current;
        const end = typeof value === "number" ? value : parseFloat(value) || 0;
        const duration = 800;
        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(start + (end - start) * eased));
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        prev.current = end;
    }, [value]);

    return (
        <span>
            {display}
            {suffix}
        </span>
    );
}

/* ── Score card ── */
function ScoreCard({ label, value, suffix = "", sublabel, color = "#ec5b13", maxValue = 100 }) {
    const numValue = typeof value === "number" ? value : parseFloat(value) || 0;
    const pct = Math.min(100, (numValue / maxValue) * 100);

    return (
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5 hover:border-[#333] transition-all duration-300 group">
            <p className="text-[#555] text-xs font-medium uppercase tracking-wider mb-3">{label}</p>
            <p className="text-3xl font-light text-white mb-2">
                <AnimatedNumber value={numValue} suffix={suffix} />
            </p>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden mb-2">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${pct}%`, background: color }}
                />
            </div>
            {sublabel && <p className="text-[#444] text-xs">{sublabel}</p>}
        </div>
    );
}

/* ── Emotion pill ── */
function EmotionPill({ emotion, count, total }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center justify-between py-2 px-3 bg-[#111] rounded-xl border border-[#1a1a1a]">
            <span className="text-[#aaa] text-sm capitalize">{emotion}</span>
            <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#ec5b13] rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <span className="text-[#666] text-xs w-8 text-right">{pct}%</span>
            </div>
        </div>
    );
}

export default function AnalyticsPanel({ analytics, loading }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 rounded-full border-2 border-[#ec5b13] border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="flex items-center justify-center h-64 text-[#444] text-sm">
                No analytics data available yet.
            </div>
        );
    }

    const emotionEntries = Object.entries(analytics.emotionDistribution || {}).sort((a, b) => b[1] - a[1]);
    const totalEmotionCount = emotionEntries.reduce((sum, [, c]) => sum + c, 0);

    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1 scrollbar-thin">
            {/* Header */}
            <div className="mb-2">
                <h2 className="text-lg font-medium text-white tracking-tight">Behavioral Intelligence</h2>
                <p className="text-[#555] text-xs mt-0.5">Real-time financial psychology metrics</p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-3">
                <ScoreCard
                    label="Impulse Score"
                    value={analytics.impulseScore}
                    suffix="/100"
                    sublabel={analytics.impulseScore > 60 ? "⚠ Elevated" : "✓ Stable"}
                    color={analytics.impulseScore > 60 ? "#ef4444" : "#22c55e"}
                />
                <ScoreCard
                    label="Control Score"
                    value={analytics.controlScore}
                    suffix="/10"
                    sublabel={analytics.controlScore >= 7 ? "Excellent" : analytics.controlScore >= 5 ? "Good" : "Needs work"}
                    color="#3b82f6"
                    maxValue={10}
                />
                <ScoreCard
                    label="Emotional Spend"
                    value={analytics.emotionalSpendingPct}
                    suffix="%"
                    sublabel="of total expenses"
                    color="#f59e0b"
                />
                <ScoreCard
                    label="Night Spending"
                    value={analytics.lateNightSpendingPercent}
                    suffix="%"
                    sublabel="after 10 PM"
                    color="#8b5cf6"
                />
            </div>

            {/* Quick Stats */}
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[#555] text-xs font-medium uppercase tracking-wider">30-Day Spend</p>
                    <p className="text-[#ec5b13] text-xs">{analytics.volatility}</p>
                </div>
                <p className="text-2xl font-light text-white">
                    ₹{(analytics.totalSpentLast30Days || 0).toLocaleString("en-IN")}
                </p>
                <p className="text-[#444] text-xs mt-1">
                    Top category: <span className="text-[#888]">{analytics.topCategory || "N/A"}</span>
                </p>
            </div>

            {/* Emotion Distribution */}
            {emotionEntries.length > 0 && (
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5">
                    <p className="text-[#555] text-xs font-medium uppercase tracking-wider mb-3">
                        Emotion Distribution
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl text-white capitalize font-light">{analytics.topEmotion || "—"}</span>
                        <span className="text-[#555] text-xs">dominant emotion</span>
                    </div>
                    <div className="space-y-1.5">
                        {emotionEntries.slice(0, 5).map(([emotion, count]) => (
                            <EmotionPill key={emotion} emotion={emotion} count={count} total={totalEmotionCount} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
