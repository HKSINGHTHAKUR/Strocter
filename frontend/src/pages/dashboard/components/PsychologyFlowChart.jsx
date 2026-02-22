import { useEffect, useState } from "react";
import LineChartWrapper from "../../../components/charts/LineChartWrapper";
import { getWealthFlow } from "../../../services/dashboardService";

const CHART_LINES = [
    { dataKey: "emotionalSpend", name: "Emotional Spend", color: "#6E33B1" },
    { dataKey: "logicalAllocation", name: "Logical Allocation", color: "#FF6A00" },
];

const FALLBACK_DATA = [
    { name: "W1", emotionalSpend: 3200, logicalAllocation: 4800 },
    { name: "W2", emotionalSpend: 4100, logicalAllocation: 4200 },
    { name: "W3", emotionalSpend: 2800, logicalAllocation: 5100 },
    { name: "W4", emotionalSpend: 5200, logicalAllocation: 3900 },
    { name: "W5", emotionalSpend: 3600, logicalAllocation: 4600 },
    { name: "W6", emotionalSpend: 4400, logicalAllocation: 5300 },
    { name: "W7", emotionalSpend: 3100, logicalAllocation: 4900 },
];

export default function PsychologyFlowChart() {
    const [flowData, setFlowData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFlowData = async () => {
            try {
                const data = await getWealthFlow();
                setFlowData(data?.flowData ?? data ?? []);
            } catch {
                setError("Unable to load wealth flow data");
                setFlowData(FALLBACK_DATA);
            } finally {
                setLoading(false);
            }
        };
        fetchFlowData();
    }, []);

    const chartData = flowData.length > 0 ? flowData : FALLBACK_DATA;

    return (
        <div className="chart-glass p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-text-primary">
                    Wealth Psychology Flow
                </p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-accent-purple" />
                        <span className="text-[10px] text-text-muted">Emotional Spend</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-accent-orange" />
                        <span className="text-[10px] text-text-muted">Logical Allocation</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 min-h-0">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 rounded-full border-2 border-accent-purple border-t-transparent animate-spin" />
                    </div>
                ) : (
                    <>
                        {error && (
                            <p className="text-text-muted text-[10px] mb-1">{error} — showing sample data</p>
                        )}
                        <LineChartWrapper
                            data={chartData}
                            lines={CHART_LINES}
                            height={200}
                            animationDuration={600}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
