import { motion } from "framer-motion";
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
} from "recharts";

export default function RiskRadarChart({ radarData, criticalFactor, status }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="rounded-2xl border border-white/[0.06] bg-[#12141A] p-6 flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Risk Radar</h3>
                <div className="w-5 h-5 rounded-full border border-white/[0.08] flex items-center justify-center text-[10px] text-text-muted cursor-help" title="Risk exposure across 4 dimensions">
                    ℹ
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 min-h-[220px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height={240}>
                    <RadarChart outerRadius={80} data={radarData ?? []}>
                        <PolarGrid stroke="rgba(255,255,255,0.06)" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fontSize: 10, fill: "#A0A3B1" }}
                        />
                        <Radar
                            dataKey="value"
                            stroke="#FF6A00"
                            fill="#FF6A00"
                            fillOpacity={0.12}
                            strokeWidth={2}
                            isAnimationActive={true}
                            animationDuration={800}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 mt-3">
                <div className="flex-1 py-2 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted">Critical Factor</p>
                    <p className="text-xs font-bold mt-0.5">{criticalFactor ?? "N/A"}</p>
                </div>
                <div className="flex-1 py-2 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted">Status</p>
                    <p className={`text-xs font-bold mt-0.5 ${status === "Defensive" ? "text-emerald-400" : "text-[#FF6A00]"}`}>
                        {status ?? "N/A"}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
