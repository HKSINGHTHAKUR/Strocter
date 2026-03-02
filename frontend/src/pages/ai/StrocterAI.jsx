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

    /* ── Fetch analytics once on mount ── */
    useEffect(() => {
        if (!hasAccess) return;

        const fetchAnalytics = async () => {
            try {
                const [behavioralRes, impulseRes, lateNightRes] = await Promise.all([
                    api.get("/analytics/behavioral-summary"),
                    api.get("/impulse/overview"),
                    api.get("/impulse/overview"),
                ]);

                const behavioral = behavioralRes.data;
                const impulse = impulseRes.data;

                // Build unified analytics summary
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
        <div className="flex min-h-screen bg-[#0a0a0a]">
            <Sidebar />
            <div className="flex-1 ml-[var(--sidebar-width)] flex flex-col">
                <TopNav />
                <main className="flex-1 flex flex-col p-6 pt-[calc(var(--topnav-height)+1.5rem)]">
                    {!hasAccess ? (
                        <PremiumGate featureName="Strocter AI" />
                    ) : (
                        <>
                            {/* Page Header */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-light text-white tracking-tight">
                                    Strocter{" "}
                                    <span className="bg-gradient-to-r from-[#ec5b13] to-[#ff8a50] bg-clip-text text-transparent font-medium">
                                        AI
                                    </span>
                                </h1>
                                <p className="text-[#555] text-sm mt-1">
                                    Financial Intelligence Center
                                </p>
                            </div>

                            {/* Two-column layout */}
                            <div className="flex-1 flex flex-col lg:flex-row gap-5 min-h-0">
                                {/* LEFT — Behavioral Intelligence Panel */}
                                <div className="lg:w-[45%] flex-shrink-0 min-h-[400px] lg:min-h-0">
                                    <AnalyticsPanel
                                        analytics={analytics}
                                        loading={analyticsLoading}
                                    />
                                </div>

                                {/* RIGHT — AI Chat Interface */}
                                <div className="lg:flex-1 min-h-[500px] lg:min-h-0">
                                    <AIChat />
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
