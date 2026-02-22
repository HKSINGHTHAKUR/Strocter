import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import MetricsGrid from "./components/MetricsGrid";
import InsightPanel from "./components/InsightPanel";
import PsychologyFlowChart from "./components/PsychologyFlowChart";
import IntelligenceFeed from "./components/IntelligenceFeed";
import BehaviorCard from "../../components/BehaviorCard";
import { getDashboardMetrics } from "../../services/dashboardService";

export default function Dashboard() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getDashboardMetrics();
                setMetrics(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    const handleMouseMove = useCallback((e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMouse({ x, y });
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    /* ── Derived behavior data ── */
    const impulse = metrics?.impulse;
    const categoryTrend = metrics?.categoryTrend;

    const dominantCategory = categoryTrend?.length
        ? categoryTrend.reduce(
            (max, c) => (c.currentWeek > (max?.currentWeek ?? 0) ? c : max),
            categoryTrend[0]
        )
        : null;

    const impulseLabel =
        impulse?.impulseScore > 60
            ? "High"
            : impulse?.impulseScore >= 30
                ? "Moderate"
                : "Low";

    const stressLabel =
        impulse?.impulseScore > 60
            ? "Elevated"
            : impulse?.impulseScore >= 30
                ? "Moderate"
                : "Neutral";

    /* ── Loading State ── */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    <p className="text-text-muted text-sm">Loading intelligence...</p>
                </div>
            </div>
        );
    }

    /* ── Error State ── */
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-8 text-center max-w-sm">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* ── Atmospheric Background ── */}
            <div className="atmo-bg">
                <div
                    className="atmo-glow-purple"
                    style={{ transform: `translate(${mouse.x * 30}px, ${mouse.y * 20}px)` }}
                />
                <div
                    className="atmo-glow-orange"
                    style={{ transform: `translate(${mouse.x * -20}px, ${mouse.y * -15}px)` }}
                />
                <div className="atmo-beam" />
            </div>

            {/* ── Noise Grain ── */}
            <div className="noise-overlay" />

            {/* ── Sidebar ── */}
            <Sidebar />

            {/* ── Top Nav ── */}
            <TopNav />

            {/* ── Main Content ── */}
            <main className="ml-[72px] pt-[64px] relative z-10">
                <div className="max-w-[1200px] mx-auto px-8 py-10 overflow-y-auto">
                    <div className="space-y-8">

                        {/* ── Page Header ── */}
                        <div className="fade-in">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Control Center
                                    </h1>
                                    <p className="text-text-secondary text-sm mt-1">
                                        AI-Powered Psychological Intelligence &amp; Financial Analysis
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20">
                                    <span className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" />
                                    <span className="text-xs font-medium text-accent-purple">
                                        Live Intelligence Sync
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ── Metrics Row (4 Cards) ── */}
                        <MetricsGrid metrics={metrics} />

                        {/* ── Autonomous Psychological Insight ── */}
                        <InsightPanel
                            personality={metrics?.personality?.personality}
                            insight={metrics?.personality?.insight}
                        />

                        {/* ── Behavior Cards + Psychology Flow Chart ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 fade-in fade-in-delay-5">
                            {/* Left: 2×2 Behavior Cards */}
                            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                                <BehaviorCard
                                    label="Impulse Score"
                                    value={impulseLabel}
                                    sub={impulse?.riskLevel ?? "Stable"}
                                    subColor="text-emerald-400"
                                    delay={1}
                                />
                                <BehaviorCard
                                    label="Dominant Cat"
                                    value={dominantCategory?.category ?? "Lifestyle"}
                                    sub={
                                        dominantCategory
                                            ? `${Math.round((dominantCategory.currentWeek / (categoryTrend?.reduce((s, c) => s + c.currentWeek, 0) || 1)) * 100)}% of total`
                                            : "67% of total"
                                    }
                                    delay={2}
                                />
                                <BehaviorCard
                                    label="Night Spending"
                                    value={impulse?.lateNightTransactions > 0 ? "Active" : "Minimal"}
                                    sub={`~${impulse?.lateNightTransactions ?? 0}% is LN`}
                                    subColor="text-accent-orange"
                                    delay={3}
                                />
                                <BehaviorCard
                                    label="Stress Pattern"
                                    value={stressLabel}
                                    sub="Normal variance"
                                    delay={4}
                                />
                            </div>

                            {/* Right: Psychology Flow Chart */}
                            <div className="lg:col-span-3">
                                <PsychologyFlowChart />
                            </div>
                        </div>

                        {/* ── Intelligence Feed Table ── */}
                        <IntelligenceFeed />

                    </div>
                </div>
            </main>
        </div>
    );
}
