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
            {payload.map((entry) => (
                <p key={entry.name} style={{ color: entry.color }}>
                    {entry.name}: ${entry.value.toLocaleString()}
                </p>
            ))}
        </div>
    );
};

export default function TriggerTimelineChart({ timeline, range, onRangeChange, loading }) {
    const RANGES = ["24h", "7d", "30d"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-white/[0.08] bg-[#12141A] p-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold">Trigger Timeline</h3>
                    <span className="text-[10px] text-text-muted">
                        — Proprietary Spike Detection
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 text-[10px]">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#FF6A00]" />
                            Impulse Spikes
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#6E33B1]" />
                            Stress Markers
                        </span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[260px] relative">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 rounded-full border-2 border-[#FF6A00] border-t-transparent animate-spin" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={timeline}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.04)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 9, fill: "#6b7280" }}
                                axisLine={false}
                                tickLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fontSize: 9, fill: "#6b7280" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="impulseSpikes"
                                name="Impulse Spikes"
                                stroke="#FF6A00"
                                strokeWidth={2.5}
                                dot={(props) => {
                                    const { cx, cy, payload } = props;
                                    if (!payload.isSpike) return null;
                                    return (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={5}
                                            fill="#FF6A00"
                                            stroke="#0B0D10"
                                            strokeWidth={2}
                                            className="animate-pulse"
                                        />
                                    );
                                }}
                                isAnimationActive={true}
                                animationDuration={900}
                            />
                            <Line
                                type="monotone"
                                dataKey="stressMarkers"
                                name="Stress Markers"
                                stroke="#6E33B1"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                                isAnimationActive={true}
                                animationDuration={900}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
}
