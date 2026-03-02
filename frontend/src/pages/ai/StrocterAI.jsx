import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import PremiumGate from "../../components/PremiumGate";
import AnalyticsPanel from "../../components/StrocterAI/AnalyticsPanel";
import AIChat from "../../components/StrocterAI/AIChat";
import { useSubscription } from "../../context/SubscriptionContext";
import api from "../../services/api";

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

    return (
        <div className="flex min-h-screen bg-[#07070a]">
            <Sidebar />
            <div className="flex-1 ml-[var(--sidebar-width)] flex flex-col">
                <TopNav />
                <main className="flex-1 flex flex-col px-6 lg:px-8 pt-[calc(var(--topnav-height)+1rem)] pb-4">
                    {!hasAccess ? (
                        <PremiumGate featureName="Strocter AI" />
                    ) : (
                        <div
                            className={`flex flex-col flex-1 min-h-0 transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                                }`}
                        >
                            {/* Page Header */}
                            <div className="mb-5 flex items-end justify-between">
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

                            {/* Grid Layout */}
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-0">
                                {/* LEFT — Intelligence Panel (5 cols) */}
                                <div
                                    className={`lg:col-span-5 min-h-[400px] lg:min-h-0 transition-all duration-500 ease-out delay-100 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                                        }`}
                                >
                                    <AnalyticsPanel analytics={analytics} loading={analyticsLoading} />
                                </div>

                                {/* Vertical Divider */}
                                <div className="hidden lg:flex items-center justify-center">
                                    <div className="w-px h-[85%] bg-gradient-to-b from-transparent via-neutral-700/50 to-transparent" />
                                </div>

                                {/* RIGHT — AI Chat (7 cols - 1 for divider = 6) */}
                                <div
                                    className={`lg:col-span-6 min-h-[500px] lg:min-h-0 transition-all duration-500 ease-out delay-200 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                                        }`}
                                >
                                    <AIChat analytics={analytics} />
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
