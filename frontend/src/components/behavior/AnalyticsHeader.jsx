import { useState } from "react";
import { motion } from "framer-motion";

const PERIODS = ["Weekly", "Monthly", "Quarterly"];

export default function AnalyticsHeader() {
    const [activePeriod, setActivePeriod] = useState("Monthly");

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Behavioral Analytics
                </h1>
                <p className="text-text-secondary text-sm mt-1">
                    Cognitive Pattern Mapping & Financial Behavior Intelligence
                </p>
            </div>

            <div className="flex items-center gap-3">
                {/* Period Toggle */}
                <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
                    {PERIODS.map((period) => (
                        <button
                            key={period}
                            onClick={() => setActivePeriod(period)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${activePeriod === period
                                    ? "bg-[#ec5b13] text-white shadow-lg shadow-[#ec5b13]/30"
                                    : "text-text-muted hover:text-white"
                                }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>

                {/* Export Report */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ec5b13] text-white text-xs font-semibold hover:bg-[#ec5b13]/90 transition-colors cursor-pointer shadow-lg shadow-[#ec5b13]/20">
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
                        />
                    </svg>
                    Export Report
                </button>
            </div>
        </motion.div>
    );
}
