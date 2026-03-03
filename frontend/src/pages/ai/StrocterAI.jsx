import { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import PremiumGate from "../../components/PremiumGate";
import AnalyticsPanel from "../../components/StrocterAI/AnalyticsPanel";
import AIChat from "../../components/StrocterAI/AIChat";
import { useSubscription } from "../../context/SubscriptionContext";
import api from "../../services/api";

/* ── Dynamic insight generator ── */
function generateInsight(analytics) {
    if (!analytics) return null;

    const parts = [];

    if (analytics.controlScore < 4)
        parts.push("Critical behavioral risk detected — control score dangerously low.");
    else if (analytics.controlScore < 6)
        parts.push("Moderate behavioral instability — control score needs attention.");

    if (analytics.emotionalSpendingPct > 70)
        parts.push("High emotional spending pattern observed across recent transactions.");
    else if (analytics.emotionalSpendingPct > 50)
        parts.push("Elevated emotional spending detected.");

    if ((analytics.impulseScore ?? 0) > 60)
        parts.push("Impulse instability detected — consider reviewing late-night activity.");

    if (analytics.lateNightSpendingPercent > 30)
        parts.push("Significant after-hours spending pattern identified.");

    if (parts.length === 0)
        parts.push("Your behavioral profile is currently stable. Continue maintaining financial discipline.");

    return parts.slice(0, 2).join(" ");
}

export default function StrocterAI() {
    const { isPremium, isTrial } = useSubscription();
    const hasAccess = isPremium || isTrial;

    const [analytics, setAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setMounted(true));
    }, []);

    /* ── Fetch analytics once on mount ── */
    useEffect(() => {
        if (!hasAccess) return;

        const fetchAnalytics = async () => {
            try {
                const [behavioralRes, impulseRes] = await Promise.all([
                    api.get("/analytics/behavioral-summary"),
                    api.get("/impulse/overview"),
                ]);

                const behavioral = behavioralRes.data;
                const impulse = impulseRes.data;

                setAnalytics({
                    impulseScore: impulse.impulseScore?.score ?? 0,
                    controlScore: parseFloat(behavioral.resilienceScore?.value) || 0,
                    emotionalSpendingPct: parseFloat(behavioral.emotionalSpending?.value) || 0,
                    lateNightSpendingPercent: impulse.lateNightWindow?.percentage ?? 0,
                    totalSpentLast30Days: impulse.totalSpent ?? 0,
                    topEmotion: impulse.topEmotion || "neutral",
                    emotionDistribution: impulse.emotionDistribution || {},
                    topCategory: impulse.topCategory || "N/A",
                    volatility: behavioral.volatilityIndex?.value || "N/A",
                });
            } catch (err) {
                console.error("Analytics fetch error:", err);
                setAnalytics(null);
            } finally {
                setAnalyticsLoading(false);
            }
        };

        fetchAnalytics();
    }, [hasAccess]);

    const insightText = useMemo(() => generateInsight(analytics), [analytics]);

    /* ── Build system context string for AI chat ── */
    const behavioralContext = useMemo(() => {
        if (!analytics) return "";
        return `User behavioral summary: Control Score ${analytics.controlScore}/10, Impulse Score ${analytics.impulseScore}/100, Emotional Spending ${analytics.emotionalSpendingPct}%, Late-Night Spending ${analytics.lateNightSpendingPercent}%, 30-Day Total ₹${(analytics.totalSpentLast30Days || 0).toLocaleString("en-IN")}, Top Emotion: ${analytics.topEmotion}, Top Category: ${analytics.topCategory}, Volatility: ${analytics.volatility}.`;
    }, [analytics]);

    return (
        <div className="min-h-screen bg-[#07070a]">
            <Sidebar />
            <TopNav />

            <main className="ml-[88px] pt-[64px] relative z-10">
                {!hasAccess ? (
                    <div className="px-10 py-8">
                        <PremiumGate featureName="Strocter AI" />
                    </div>
                ) : (
                    <div
                        className={`flex flex-col px-8 py-6 transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                            }`}
                    >
                        {/* Page Header */}
                        <div className="mb-5 flex items-end justify-between flex-shrink-0">
                            <div>
                                <h1 className="text-2xl font-semibold text-white tracking-tight">
                                    Strocter{" "}
                                    <span className="bg-gradient-to-r from-[#ec5b13] to-[#ff8a50] bg-clip-text text-transparent">
                                        AI
                                    </span>
                                </h1>
                                <p className="text-neutral-500 text-xs mt-1 tracking-wide">
                                    Financial Intelligence Command Center
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-neutral-600 text-xs">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                System Active
                            </div>
                        </div>

                        {/* ── STEP 2: AI Insight Snapshot Strip ── */}
                        {insightText && (
                            <div
                                className={`mb-6 rounded-xl border border-orange-500/20 bg-orange-500/[0.04] p-4 flex items-center gap-4 transition-all duration-500 delay-150 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                                    }`}
                            >
                                <div className="text-orange-400 text-lg flex-shrink-0">⚡</div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-orange-400 uppercase tracking-[0.12em] mb-0.5">AI Insight</p>
                                    <p className="text-sm text-neutral-300 leading-relaxed">{insightText}</p>
                                </div>
                            </div>
                        )}

                        {/* ── Grid — natural height, page scrolls ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[calc(100vh-220px)]">
                            {/* LEFT — Intelligence Panel (5 cols) */}
                            <div
                                className={`lg:col-span-5 transition-all duration-500 ease-out delay-100 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                                    }`}
                            >
                                <AnalyticsPanel analytics={analytics} loading={analyticsLoading} />
                            </div>

                            {/* ── STEP 7: Vertical Panel Divider Glow ── */}
                            <div className="hidden lg:flex items-center justify-center">
                                <div className="w-px h-[90%] bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
                            </div>

                            {/* RIGHT — AI Chat (6 cols) */}
                            <div
                                className={`lg:col-span-6 transition-all duration-500 ease-out delay-200 min-h-[600px] ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                                    }`}
                            >
                                <AIChat analytics={analytics} behavioralContext={behavioralContext} />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
