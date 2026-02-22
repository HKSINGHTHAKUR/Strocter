import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import WealthHeader from "../../components/Wealth/WealthHeader";
import StabilityMetricsRow from "../../components/Wealth/StabilityMetricsRow";
import StabilityTrendChart from "../../components/Wealth/StabilityTrendChart";
import RiskRadarChart from "../../components/Wealth/RiskRadarChart";
import AssetAllocationPanel from "../../components/Wealth/AssetAllocationPanel";
import StrategicGrowthOutlook from "../../components/Wealth/StrategicGrowthOutlook";
import {
    getWealthOverview,
    getWealthTrend,
    getWealthRadar,
    getWealthAllocation,
    getWealthOutlook,
} from "../../services/wealthService";

export default function WealthStability() {
    const [overview, setOverview] = useState(null);
    const [trendResult, setTrendResult] = useState({ trend: [], forecastedIndex: 0, resilienceDelta: 0 });
    const [radarResult, setRadarResult] = useState({ radar: [], criticalFactor: "", status: "" });
    const [allocation, setAllocation] = useState(null);
    const [outlook, setOutlook] = useState(null);
    const [range, setRange] = useState("1Y");
    const [loading, setLoading] = useState(true);
    const [trendLoading, setTrendLoading] = useState(false);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    /* ── Parallax ── */
    const handleMouseMove = useCallback((e) => {
        setMouse({
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2,
        });
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    /* ── Fetch all ── */
    useEffect(() => {
        const init = async () => {
            try {
                const [ov, tr, rd, al, ol] = await Promise.all([
                    getWealthOverview(),
                    getWealthTrend("1Y"),
                    getWealthRadar(),
                    getWealthAllocation(),
                    getWealthOutlook(),
                ]);
                setOverview(ov);
                setTrendResult(tr);
                setRadarResult(rd);
                setAllocation(al);
                setOutlook(ol);
            } catch (err) {
                console.error("Wealth init error:", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    /* ── Range change ── */
    const handleRangeChange = useCallback(async (newRange) => {
        setRange(newRange);
        setTrendLoading(true);
        try {
            const tr = await getWealthTrend(newRange);
            setTrendResult(tr);
        } catch (err) {
            console.error("Trend fetch error:", err);
        } finally {
            setTrendLoading(false);
        }
    }, []);

    return (
        <div className="min-h-screen">
            {/* ── Atmospheric Background ── */}
            <div className="atmo-bg">
                <div className="atmo-glow-purple" style={{ transform: `translate(${mouse.x * 30}px, ${mouse.y * 20}px)` }} />
                <div className="atmo-glow-orange" style={{ transform: `translate(${mouse.x * -20}px, ${mouse.y * -15}px)` }} />
                <div className="atmo-beam" />
            </div>
            <div className="noise-overlay" />

            <Sidebar />
            <TopNav />

            <main className="ml-[72px] pt-[64px] relative z-10">
                <div className="max-w-[1400px] mx-auto px-10 py-8 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <div className="w-8 h-8 rounded-full border-2 border-[#38E6A2] border-t-transparent animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* ── Header ── */}
                            <WealthHeader range={range} onRangeChange={handleRangeChange} />

                            {/* ── Metrics ── */}
                            <StabilityMetricsRow data={overview} />

                            {/* ── Trend Chart ── */}
                            <StabilityTrendChart
                                trendData={trendResult.trend}
                                forecastedIndex={trendResult.forecastedIndex}
                                resilienceDelta={trendResult.resilienceDelta}
                                loading={trendLoading}
                            />

                            {/* ── Radar + Allocation ── */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <RiskRadarChart
                                    radarData={radarResult.radar}
                                    criticalFactor={radarResult.criticalFactor}
                                    status={radarResult.status}
                                />
                                <AssetAllocationPanel allocation={allocation} />
                            </div>

                            {/* ── Strategic Outlook ── */}
                            <StrategicGrowthOutlook outlook={outlook} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
