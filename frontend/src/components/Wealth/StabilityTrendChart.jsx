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

export default function StabilityTrendChart({ trendData, forecastedIndex, resilienceDelta, loading }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-white/[0.06] bg-[#12141A] p-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-sm font-semibold">Stability Trend Model</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">
                        Historical performance vs AI-projected resilience
                    </p>
                </div>
                <div className="flex items-center gap-5 text-[10px]">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-[2px] rounded-full bg-[#38E6A2]" />
                        Historical
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-[2px] rounded-full bg-[#6E33B1]" style={{ borderBottom: "1px dashed" }} />
                        Projection
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[240px]">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 rounded-full border-2 border-[#38E6A2] border-t-transparent animate-spin" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="historical"
                                name="Historical"
                                stroke="#38E6A2"
                                strokeWidth={2.5}
                                dot={false}
                                connectNulls={false}
                                isAnimationActive={true}
                                animationDuration={900}
                            />
                            <Line
                                type="monotone"
                                dataKey="projection"
                                name="Projection"
                                stroke="#6E33B1"
                                strokeDasharray="6 4"
                                strokeWidth={2.5}
                                dot={false}
                                connectNulls={false}
                                isAnimationActive={true}
                                animationDuration={900}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Footer stats */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-8">
                    <div>
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted">Forecasted Index</p>
                        <p className="text-lg font-bold text-[#6E33B1]">{forecastedIndex ?? 0}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted">Resilience Delta</p>
                        <p className={`text-lg font-bold ${(resilienceDelta ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {(resilienceDelta ?? 0) >= 0 ? "+" : ""}{resilienceDelta ?? 0}%
                        </p>
                    </div>
                </div>
                <p className="text-[10px] text-text-muted italic max-w-[300px] text-right">
                    "Projection accounts for current savings rate and low variable spending."
                </p>
            </div>
        </motion.div>
    );
}
