import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import ImpulseMetrics from "../../components/Impulse/ImpulseMetrics";
import TriggerTimelineChart from "../../components/Impulse/TriggerTimelineChart";
import TriggerBreakdownCards from "../../components/Impulse/TriggerBreakdownCards";
import SimulationPanel from "../../components/Impulse/SimulationPanel";
import {
    getImpulseOverview,
    getImpulseTimeline,
    runImpulseSimulation,
} from "../../services/impulseService";

export default function ImpulseLab() {
    const [overview, setOverview] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [simResult, setSimResult] = useState(null);
    const [range, setRange] = useState("24h");
    const [loading, setLoading] = useState(true);
    const [tlLoading, setTlLoading] = useState(false);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    /* ── Parallax ── */
    const handleMouseMove = useCallback((e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMouse({ x, y });
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    /* ── Fetch overview + initial timeline + initial sim ── */
    useEffect(() => {
        const init = async () => {
            try {
                const [ov, tl, sim] = await Promise.all([
                    getImpulseOverview(),
                    getImpulseTimeline("24h"),
                    runImpulseSimulation(65),
                ]);
                setOverview(ov);
                setTimeline(tl.timeline ?? []);
                setSimResult(sim);
            } catch (err) {
                console.error("Impulse Lab init error:", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    /* ── Range change → refetch timeline ── */
    const handleRangeChange = useCallback(async (newRange) => {
        setRange(newRange);
        setTlLoading(true);
        try {
            const tl = await getImpulseTimeline(newRange);
            setTimeline(tl.timeline ?? []);
        } catch (err) {
            console.error("Timeline fetch error:", err);
        } finally {
            setTlLoading(false);
        }
    }, []);

    /* ── Simulation ── */
    const handleSimulate = useCallback(async (frictionValue) => {
        try {
            const result = await runImpulseSimulation(frictionValue);
            setSimResult(result);
        } catch (err) {
            console.error("Simulation error:", err);
        }
    }, []);

    const RANGES = ["24h", "7d", "30d"];

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
            <div className="noise-overlay" />

            <Sidebar />
            <TopNav />

            <main className="ml-[72px] pt-[64px] relative z-10">
                <div className="max-w-[1400px] mx-auto px-10 py-8 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <div className="w-8 h-8 rounded-full border-2 border-[#FF6A00] border-t-transparent animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* ── Header ── */}
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 fade-in">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Impulse AI Lab
                                    </h1>
                                    <p className="text-text-secondary text-sm mt-1">
                                        Real-time Behavioral Trigger Analysis & Cognitive Simulation
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Range Toggle */}
                                    <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
                                        {RANGES.map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => handleRangeChange(r)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer uppercase ${range === r
                                                        ? "bg-white/[0.1] text-white"
                                                        : "text-text-muted hover:text-white"
                                                    }`}
                                            >
                                                {r === "24h" ? "24H" : r === "7d" ? "7D" : "30D"}
                                            </button>
                                        ))}
                                    </div>

                                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-xs font-semibold hover:bg-white/[0.08] transition-colors cursor-pointer">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
                                        </svg>
                                        Export
                                    </button>

                                    <button
                                        onClick={() => handleSimulate(65)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF6A00] text-white text-xs font-semibold hover:bg-[#FF6A00]/90 transition-colors cursor-pointer shadow-lg shadow-[#FF6A00]/20"
                                    >
                                        Run Simulation
                                    </button>
                                </div>
                            </div>

                            {/* ── Top 4 Metrics ── */}
                            <ImpulseMetrics data={overview} />

                            {/* ── Trigger Timeline Chart ── */}
                            <TriggerTimelineChart
                                timeline={timeline}
                                range={range}
                                onRangeChange={handleRangeChange}
                                loading={tlLoading}
                            />

                            {/* ── Breakdown Cards ── */}
                            <TriggerBreakdownCards data={overview} />

                            {/* ── Simulation Panel ── */}
                            <SimulationPanel
                                onSimulate={handleSimulate}
                                simResult={simResult}
                                loading={loading}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
