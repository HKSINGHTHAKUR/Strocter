import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import MetricCard from "../components/MetricCard";
import AIInsightPanel from "../components/AIInsightPanel";
import BehaviorCard from "../components/BehaviorCard";
import SpendingChart from "../components/SpendingChart";
import RecentTransactions from "../components/RecentTransactions";

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/insights/dashboard");
                setData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    // Parallax mouse tracking
    const handleMouseMove = useCallback((e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMouse({ x, y });
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
                    <p className="text-text-muted text-sm">Loading intelligence...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-8 text-center max-w-sm">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const { stability, impulse, risk, categoryTrend, weeklySummary, personality } = data;

    // Find dominant category
    const dominantCategory = categoryTrend?.length
        ? categoryTrend.reduce((max, c) => (c.currentWeek > (max?.currentWeek ?? 0) ? c : max), categoryTrend[0])
        : null;

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
                <div className="max-w-[1200px] mx-auto px-8 py-10">

                    {/* Page Title */}
                    <div className="mb-10 fade-in">
                        <h1 className="text-3xl font-bold tracking-tight">Control Center</h1>
                        <p className="text-text-secondary text-sm mt-1">Your financial intelligence at a glance</p>
                    </div>

                    {/* ── Hero Metrics ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        <MetricCard
                            label="Health Score"
                            value={stability?.financialHealthScore ?? "—"}
                            sub={stability?.healthLevel ?? ""}
                            delay={1}
                        />
                        <MetricCard
                            label="Risk Status"
                            value={risk?.riskLevel ?? "—"}
                            sub={risk?.volatilityScore ? `Volatility: ${risk.volatilityScore}` : ""}
                            delay={2}
                        />
                        <MetricCard
                            label="Weekly Trend"
                            value={weeklySummary?.changePercentage != null ? `${weeklySummary.changePercentage}%` : "—"}
                            sub={weeklySummary?.trend ?? ""}
                            delay={3}
                        />
                        <MetricCard
                            label="Stability"
                            value={stability?.healthLevel ?? "—"}
                            sub={stability?.impulseScore != null ? `Impulse: ${stability.impulseScore}` : ""}
                            delay={4}
                        />
                    </div>

                    {/* ── AI Insight Panel ── */}
                    <div className="mb-8">
                        <AIInsightPanel
                            personality={personality?.personality}
                            insight={personality?.insight}
                        />
                    </div>

                    {/* ── Behavioral Insights Grid ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        <BehaviorCard
                            label="Impulse Score"
                            value={impulse?.impulseScore != null ? `${impulse.impulseScore}%` : "—"}
                            sub={impulse?.riskLevel ?? ""}
                            delay={1}
                            icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                            }
                        />
                        <BehaviorCard
                            label="Top Category"
                            value={dominantCategory?.category ?? "—"}
                            sub={dominantCategory ? `₹${dominantCategory.currentWeek.toLocaleString()} this week` : ""}
                            delay={2}
                            icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                            }
                        />
                        <BehaviorCard
                            label="Night Spending"
                            value={impulse?.lateNightTransactions ?? "0"}
                            sub="Transactions after 10PM"
                            delay={3}
                            icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                            }
                        />
                        <BehaviorCard
                            label="Stress Pattern"
                            value={
                                impulse?.impulseScore > 60 ? "Detected" :
                                    impulse?.impulseScore >= 30 ? "Moderate" : "Low"
                            }
                            sub={`${impulse?.weekendTransactions ?? 0} weekend transactions`}
                            delay={4}
                            icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                            }
                        />
                    </div>

                    {/* ── Chart + Transactions Row ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                        <div className="lg:col-span-3">
                            <SpendingChart />
                        </div>
                        <div className="lg:col-span-2">
                            <RecentTransactions />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
