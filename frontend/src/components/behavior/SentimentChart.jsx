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

const CHART_DATA = [
    { name: "WK 01", emotional: 42, logical: 58 },
    { name: "WK 02", emotional: 38, logical: 55 },
    { name: "WK 03", emotional: 51, logical: 47 },
    { name: "WK 04", emotional: 35, logical: 62 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl bg-[#1a1c24] border border-white/[0.1] px-3 py-2 text-[11px] shadow-xl">
            <p className="text-text-muted font-semibold mb-1">{label}</p>
            {payload.map((entry) => (
                <p key={entry.name} style={{ color: entry.color }}>
                    {entry.name}: {entry.value}%
                </p>
            ))}
        </div>
    );
};

export default function SentimentChart() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl border border-white/[0.08] bg-[#12141A] p-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold">
                    Sentiment Intelligence Trend
                </h3>
                <div className="flex items-center gap-4 text-[10px]">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-[2px] rounded-full bg-[#6E33B1]" />
                        Emotional
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-[2px] rounded-full bg-emerald-500" />
                        Logical
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={CHART_DATA}
                        margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.04)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 10, fill: "#6b7280" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: "#6b7280" }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 100]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="emotional"
                            name="Emotional"
                            stroke="#6E33B1"
                            strokeWidth={2.5}
                            dot={false}
                            isAnimationActive={true}
                            animationDuration={800}
                        />
                        <Line
                            type="monotone"
                            dataKey="logical"
                            name="Logical"
                            stroke="#38E6A2"
                            strokeWidth={2.5}
                            dot={false}
                            isAnimationActive={true}
                            animationDuration={800}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
