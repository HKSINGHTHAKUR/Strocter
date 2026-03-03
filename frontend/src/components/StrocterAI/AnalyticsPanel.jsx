import { useEffect, useState, useRef } from "react";

/* ── Animated counter ── */
function AnimatedNumber({ value, suffix = "" }) {
    const [display, setDisplay] = useState(0);
    const prev = useRef(0);

    useEffect(() => {
        const start = prev.current;
        const end = typeof value === "number" ? value : parseFloat(value) || 0;
        const duration = 900;
        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round((start + (end - start) * eased) * 10) / 10);
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        prev.current = end;
    }, [value]);

    return (
        <span>
            {Number.isInteger(display) ? display : display.toFixed(1)}
            {suffix}
        </span>
    );
}

/* ── Progress bar (animated) ── */
function ProgressBar({ value, max = 100, color }) {
    const pct = Math.min(100, (value / max) * 100);
    return (
        <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden mt-2.5">
            <div
                className="h-full rounded-full transition-all duration-[1200ms] ease-out"
                style={{ width: `${pct}%`, background: color }}
            />
        </div>
    );
}

/* ── Score card with hover lift ── */
function ScoreCard({ label, value, suffix = "", sublabel, color = "#ec5b13", maxValue = 100, risk = false }) {
    const numValue = typeof value === "number" ? value : parseFloat(value) || 0;

    return (
        <div
            className={`relative bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 
                hover:-translate-y-1 hover:shadow-lg hover:bg-white/[0.04] 
                transition-all duration-300 ease-out cursor-default
                ${risk ? "ring-1 ring-red-500/20" : ""}`}
        >
            {risk && (
                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            )}
            <p className="text-neutral-500 text-[10px] font-semibold uppercase tracking-[0.12em] mb-2">{label}</p>
            <p className="text-2xl font-bold text-white leading-none">
                <AnimatedNumber value={numValue} suffix={suffix} />
            </p>
            <ProgressBar value={numValue} max={maxValue} color={color} />
            {sublabel && (
                <p className="text-neutral-600 text-[10px] mt-2">{sublabel}</p>
            )}
        </div>
    );
}

/* ── Emotion row ── */
function EmotionRow({ emotion, count, total }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-3 py-1.5">
            <span className="text-neutral-400 text-xs capitalize w-16 truncate">{emotion}</span>
            <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#ec5b13] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-neutral-600 text-[10px] w-8 text-right font-mono">{pct}%</span>
        </div>
    );
}

/* ── Section divider ── */
function Divider() {
    return <div className="h-px bg-neutral-800 my-4" />;
}

export default function AnalyticsPanel({ analytics, loading }) {
    if (loading) {
        return (
            <div className="bg-neutral-900/70 backdrop-blur-xl rounded-2xl border border-neutral-800 shadow-[0_0_40px_rgba(0,0,0,0.6)] h-full flex items-center justify-center min-h-[400px]">
                <div className="w-5 h-5 rounded-full border-2 border-[#ec5b13] border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="bg-neutral-900/70 backdrop-blur-xl rounded-2xl border border-neutral-800 shadow-[0_0_40px_rgba(0,0,0,0.6)] h-full flex items-center justify-center min-h-[400px]">
                <p className="text-neutral-600 text-sm">No data available</p>
            </div>
        );
    }

    const emotionEntries = Object.entries(analytics.emotionDistribution || {}).sort((a, b) => b[1] - a[1]);
    const totalEmotions = emotionEntries.reduce((sum, [, c]) => sum + c, 0);
    const isHighRisk = (analytics.impulseScore ?? 0) > 60;

    return (
        <div className="bg-neutral-900/70 backdrop-blur-xl rounded-2xl border border-neutral-800 shadow-[0_0_40px_rgba(0,0,0,0.6)] h-auto flex flex-col p-5">
            {/* Panel Header */}
            <div className="mb-5 flex-shrink-0">
                <h2 className="text-lg font-medium text-white tracking-tight">Behavioral Intelligence</h2>
                <p className="text-neutral-600 text-[11px] mt-0.5 tracking-wide">Real-time financial psychology metrics</p>
            </div>

            {/* Content — no inner scroll, flows naturally */}
            <div className="space-y-1">
                {/* Section 1 — Primary Scores */}
                <div>
                    <p className="text-neutral-600 text-[10px] font-semibold uppercase tracking-[0.12em] mb-2.5">Primary Scores</p>
                    <div className="grid grid-cols-2 gap-2.5">
                        <ScoreCard
                            label="Control Score"
                            value={analytics.controlScore}
                            suffix="/10"
                            sublabel={analytics.controlScore >= 7 ? "Excellent" : analytics.controlScore >= 5 ? "Good" : "Critical"}
                            color="#3b82f6"
                            maxValue={10}
                        />
                        <ScoreCard
                            label="Impulse Score"
                            value={analytics.impulseScore}
                            suffix="/100"
                            sublabel={isHighRisk ? "Elevated Risk" : "Within Range"}
                            color={isHighRisk ? "#ef4444" : "#22c55e"}
                            risk={isHighRisk}
                        />
                    </div>
                </div>

                <Divider />

                {/* Section 2 — Spending Patterns */}
                <div>
                    <p className="text-neutral-600 text-[10px] font-semibold uppercase tracking-[0.12em] mb-2.5">Spending Patterns</p>
                    <div className="grid grid-cols-2 gap-2.5">
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
                </div>

                <Divider />

                {/* Section 3 — 30-Day Summary */}
                <div>
                    <p className="text-neutral-600 text-[10px] font-semibold uppercase tracking-[0.12em] mb-2.5">30-Day Overview</p>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-neutral-500 text-[10px] font-semibold uppercase tracking-[0.12em]">Total Spend</p>
                            <span className="text-[10px] text-neutral-600 font-mono">{analytics.volatility}</span>
                        </div>
                        <p className="text-xl font-bold text-white">
                            ₹{(analytics.totalSpentLast30Days || 0).toLocaleString("en-IN")}
                        </p>
                        <p className="text-neutral-600 text-[10px] mt-1.5">
                            Top category: <span className="text-neutral-400">{analytics.topCategory || "N/A"}</span>
                        </p>
                    </div>
                </div>

                {/* Emotion Distribution */}
                {emotionEntries.length > 0 && (
                    <>
                        <Divider />
                        <div>
                            <p className="text-neutral-600 text-[10px] font-semibold uppercase tracking-[0.12em] mb-2.5">Emotion Distribution</p>
                            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-base text-white capitalize font-medium">{analytics.topEmotion}</span>
                                    <span className="text-neutral-600 text-[10px]">dominant</span>
                                </div>
                                <div className="space-y-0.5">
                                    {emotionEntries.slice(0, 5).map(([emotion, count]) => (
                                        <EmotionRow key={emotion} emotion={emotion} count={count} total={totalEmotions} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <Divider />

                {/* AI Quick Insight */}
                <div className="bg-gradient-to-br from-[#ec5b13]/5 to-transparent border border-[#ec5b13]/10 rounded-xl p-4">
                    <p className="text-neutral-500 text-[10px] font-semibold uppercase tracking-[0.12em] mb-2">AI Insight</p>
                    <p className="text-neutral-300 text-xs leading-relaxed">
                        {isHighRisk
                            ? `Your impulse score of ${analytics.impulseScore}/100 indicates elevated emotional spending. Consider reviewing your ${analytics.topEmotion}-driven transactions.`
                            : `Your behavioral metrics show stable patterns. Control score of ${analytics.controlScore}/10 suggests good financial discipline.`}
                    </p>
                </div>
            </div>
        </div>
    );
}
