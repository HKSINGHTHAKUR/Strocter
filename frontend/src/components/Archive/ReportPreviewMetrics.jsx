import { motion } from "framer-motion";

const METRIC_BARS = [
    { key: "stability", label: "Stability Rating", color: "bg-emerald-500" },
    { key: "riskVariance", label: "Risk Variance", color: "bg-[#ec5b13]" },
    { key: "emotionalSpend", label: "Emotional Spend %", color: "bg-[#6E33B1]" },
];

export default function ReportPreviewMetrics({ metrics, projectionText }) {
    return (
        <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#0B0D10]/60 mb-4">
                Key Health Metrics
            </p>

            <div className="space-y-5">
                {METRIC_BARS.map((bar) => {
                    const value = metrics?.[bar.key] ?? 0;
                    return (
                        <div key={bar.key}>
                            <p className="text-[10px] text-[#0B0D10]/50 font-semibold mb-1.5">
                                {bar.label}
                            </p>
                            <div className="w-full h-2 rounded-full bg-[#0B0D10]/[0.06] overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${value}%` }}
                                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                                    className={`h-full rounded-full ${bar.color}`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Projection */}
            <div className="mt-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#0B0D10]/60 mb-2">
                    6-Month Projection
                </p>
                <p className="text-[10px] text-[#0B0D10]/50 leading-relaxed italic">
                    {projectionText}
                </p>
            </div>

            {/* Trend placeholder */}
            <div className="mt-4 h-16 rounded-lg bg-[#0B0D10]/[0.03] flex items-center justify-center">
                <svg className="w-full h-10 text-[#0B0D10]/10" viewBox="0 0 200 40">
                    <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        points="0,35 20,30 40,32 60,25 80,20 100,22 120,15 140,18 160,10 180,12 200,5"
                    />
                </svg>
            </div>
        </div>
    );
}
