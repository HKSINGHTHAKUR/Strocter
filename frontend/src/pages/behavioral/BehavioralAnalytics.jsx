import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import AnalyticsHeader from "../../components/behavior/AnalyticsHeader";
import MetricsRow from "../../components/behavior/MetricsRow";
import HeatmapPanel from "../../components/behavior/HeatmapPanel";
import CognitivePanel from "../../components/behavior/CognitivePanel";
import SentimentChart from "../../components/behavior/SentimentChart";
import CategoryBreakdown from "../../components/behavior/CategoryBreakdown";

export default function BehavioralAnalytics() {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMouse({ x, y });
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    return (
        <div className="min-h-screen">
            {/* ── Atmospheric Background ── */}
            <div className="atmo-bg">
                <div
                    className="atmo-glow-purple"
                    style={{
                        transform: `translate(${mouse.x * 30}px, ${mouse.y * 20}px)`,
                    }}
                />
                <div
                    className="atmo-glow-orange"
                    style={{
                        transform: `translate(${mouse.x * -20}px, ${mouse.y * -15}px)`,
                    }}
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
                <div className="max-w-[1400px] mx-auto px-10 py-8 overflow-y-auto">
                    <div className="space-y-6">
                        {/* ── Header ── */}
                        <AnalyticsHeader />

                        {/* ── Metrics Row (5 Cards) ── */}
                        <MetricsRow />

                        {/* ── Heatmap + Cognitive Side-by-Side ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                            <div className="lg:col-span-3">
                                <HeatmapPanel />
                            </div>
                            <div className="lg:col-span-2">
                                <CognitivePanel />
                            </div>
                        </div>

                        {/* ── Sentiment + Category Side-by-Side ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <SentimentChart />
                            <CategoryBreakdown />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
