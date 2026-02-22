import { motion } from "framer-motion";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl bg-[#1a1c24] border border-white/[0.1] px-3 py-2 text-[11px] shadow-xl">
            <p className="text-text-muted font-semibold mb-1">{label}</p>
            {payload.map((entry) =>
                entry.value !== null ? (
                    <p key={entry.name} style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ) : null
            )}
        </div>
    );
};

export default function GoalTrajectoryChart({ trajectoryData, insight, loading }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-[#2D3139] bg-[#12141A] p-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-sm font-semibold">Goal Performance Trajectory</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">
                        Comparing current trajectory vs projection logic
                    </p>
                </div>
                <div className="flex items-center gap-5 text-[10px]">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#ec5b13]" />
                        Actual
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full border border-[#2D3139]" />
                        Projection
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[260px]">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 rounded-full border-2 border-[#ec5b13] border-t-transparent animate-spin" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trajectoryData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid stroke="#1D2128" strokeOpacity={0.2} vertical={false} />
                            <XAxis dataKey="date" stroke="#4B5563" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#4B5563" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="actual"
                                name="Actual"
                                stroke="#ec5b13"
                                strokeWidth={2}
                                dot={{ r: 4, fill: "#ec5b13" }}
                                connectNulls={false}
                                isAnimationActive={true}
                                animationDuration={900}
                            />
                            <Line
                                type="monotone"
                                dataKey="projection"
                                name="Projection"
                                stroke="#2D3139"
                                strokeDasharray="4 4"
                                strokeWidth={2}
                                dot={false}
                                connectNulls={false}
                                isAnimationActive={true}
                                animationDuration={900}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Insight */}
            {insight && (
                <div className="flex items-start gap-3 mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[#ec5b13] text-sm mt-0.5">ℹ</span>
                    <p className="text-[10px] text-text-muted italic leading-relaxed">
                        {insight}
                    </p>
                </div>
            )}
        </motion.div>
    );
}
