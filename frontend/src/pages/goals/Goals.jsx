import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import GoalsHeader from "../../components/Goals/GoalsHeader";
import GoalsOverviewCards from "../../components/Goals/GoalsOverviewCards";
import GoalTrajectoryChart from "../../components/Goals/GoalTrajectoryChart";
import AIStrategyMemo from "../../components/Goals/AIStrategyMemo";
import CreateGoalForm from "../../components/Goals/CreateGoalForm";
import MilestoneTracker from "../../components/Goals/MilestoneTracker";
import ImpactSummaryStrip from "../../components/Goals/ImpactSummaryStrip";
import {
    getGoalsOverview,
    getGoalsTrajectory,
    getAIMemo,
    getMilestones,
    getImpactSummary,
} from "../../services/goalsService";

export default function Goals() {
    const [overview, setOverview] = useState(null);
    const [trajectoryResult, setTrajectoryResult] = useState({ trajectory: [], insight: "" });
    const [memo, setMemo] = useState(null);
    const [milestones, setMilestones] = useState([]);
    const [impact, setImpact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

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

    const fetchAll = useCallback(async () => {
        try {
            const [ov, tr, ai, ms, im] = await Promise.all([
                getGoalsOverview(),
                getGoalsTrajectory(),
                getAIMemo(),
                getMilestones(),
                getImpactSummary(),
            ]);
            setOverview(ov);
            setTrajectoryResult(tr);
            setMemo(ai);
            setMilestones(ms.milestones || ms);
            setImpact(im);
        } catch (err) {
            console.error("Goals init error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const handleGoalCreated = () => {
        setLoading(true);
        fetchAll();
    };

    return (
        <div className="min-h-screen">
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
                            <div className="w-8 h-8 rounded-full border-2 border-[#ec5b13] border-t-transparent animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <GoalsHeader onCreateClick={() => setShowCreateForm(true)} />

                            <GoalsOverviewCards overview={overview} />

                            {/* Trajectory + AI Memo side-by-side */}
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                                <div className="lg:col-span-3">
                                    <GoalTrajectoryChart
                                        trajectoryData={trajectoryResult.trajectory}
                                        insight={trajectoryResult.insight}
                                        loading={false}
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <AIStrategyMemo memo={memo} />
                                </div>
                            </div>

                            <MilestoneTracker milestones={milestones} />

                            <ImpactSummaryStrip impact={impact} />
                        </div>
                    )}
                </div>
            </main>

            <CreateGoalForm
                show={showCreateForm}
                onClose={() => setShowCreateForm(false)}
                onCreated={handleGoalCreated}
            />
        </div>
    );
}
