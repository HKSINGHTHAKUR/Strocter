import { motion } from "framer-motion";

const RISK_COLORS = {
    LOW: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    MEDIUM: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    HIGH: "bg-[#ec5b13]/15 text-[#ec5b13] border-[#ec5b13]/20",
};

export default function ReportsTable({ reports }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
        >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-4">
                Historical Documentation Log
            </p>

            <div className="rounded-2xl border border-white/[0.06] bg-[#12141A] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {["Report Type", "Date Generated", "Period Covered", "Stability Score", "Risk Level", "AI Confidence", "Action"].map((h) => (
                                    <th key={h} className="px-5 py-3.5 text-[9px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((row, i) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                                >
                                    <td className="px-5 py-4 text-xs font-semibold whitespace-nowrap">{row.type}</td>
                                    <td className="px-5 py-4 text-[11px] text-text-muted whitespace-nowrap">{row.dateGenerated}</td>
                                    <td className="px-5 py-4 text-[11px] text-text-muted whitespace-nowrap">{row.period}</td>
                                    <td className="px-5 py-4 text-xs font-semibold">{row.stability}</td>
                                    <td className="px-5 py-4">
                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${RISK_COLORS[row.risk] || RISK_COLORS.LOW}`}>
                                            {row.risk}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-[11px] text-text-muted">{row.confidence}%</td>
                                    <td className="px-5 py-4">
                                        <button className="text-text-muted hover:text-[#ec5b13] transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
