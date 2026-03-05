import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import PremiumGate from "../../components/PremiumGate";
import AnalyticsHeader from "../../components/behavior/AnalyticsHeader";
import MetricsRow from "../../components/behavior/MetricsRow";
import HeatmapPanel from "../../components/behavior/HeatmapPanel";
import CognitivePanel from "../../components/behavior/CognitivePanel";
import SentimentChart from "../../components/behavior/SentimentChart";
import CategoryBreakdown from "../../components/behavior/CategoryBreakdown";
import {
    getBehavioralSummary,
    getHeatmap,
    getCognitive,
    getSentiment,
    getCategoryBreakdown,
} from "../../services/behavioralService";

export default function BehavioralAnalytics() {
    const [metrics, setMetrics] = useState(null);
    const [heatmap, setHeatmap] = useState(null);
    const [cognitive, setCognitive] = useState(null);
    const [sentiment, setSentiment] = useState(null);
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const init = async () => {
            try {
                const [m, h, c, s, cat] = await Promise.all([
                    getBehavioralSummary(),
                    getHeatmap(),
                    getCognitive(),
                    getSentiment(),
                    getCategoryBreakdown(),
                ]);
                setMetrics(m);
                setHeatmap(h);
                setCognitive(c);
                setSentiment(s);
                setCategories(cat);
            } catch (err) {
                console.error("Behavioral init error:", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    return (
        <PremiumGate>
            <div className="min-h-screen">
                <div className="atmo-bg">
                    <div className="atmo-glow-purple" style={{ transform: `translate(${mouse.x * 30}px, ${mouse.y * 20}px)` }} />
                    <div className="atmo-glow-orange" style={{ transform: `translate(${mouse.x * -20}px, ${mouse.y * -15}px)` }} />
                    <div className="atmo-beam" />
                </div>
                <div className="noise-overlay" />
                <Sidebar />
                <TopNav />
                <main className="ml-[64px] pt-[64px] relative z-10">
                    <div className="max-w-[1400px] mx-auto px-10 py-8 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-32">
                                <div className="w-8 h-8 rounded-full border-2 border-[#6E33B1] border-t-transparent animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <AnalyticsHeader />
                                <MetricsRow metrics={metrics} />
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                                    <div className="lg:col-span-3">
                                        <HeatmapPanel heatmapData={heatmap?.heatmap} insight={heatmap?.insight} />
                                    </div>
                                    <div className="lg:col-span-2">
                                        <CognitivePanel cognitive={cognitive} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                    <SentimentChart sentimentData={sentiment} />
                                    <CategoryBreakdown categories={categories} />
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </PremiumGate>
    );
}
