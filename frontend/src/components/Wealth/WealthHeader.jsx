import { useState } from "react";
import { motion } from "framer-motion";

const RANGES = ["6M", "1Y", "3Y"];

export default function WealthHeader({ range, onRangeChange }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Wealth & Stability
                </h1>
                <p className="text-text-secondary text-sm mt-1">
                    Long-term Financial Resilience & Risk Positioning
                </p>
            </div>

            <div className="flex items-center gap-3">
                {/* Range toggle */}
                <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
                    {RANGES.map((r) => (
                        <button
                            key={r}
                            onClick={() => onRangeChange(r)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${range === r
                                    ? "bg-[#38E6A2] text-[#0B0D10] shadow-lg shadow-[#38E6A2]/20"
                                    : "text-text-muted hover:text-white"
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                {/* Download */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-xs font-semibold hover:bg-white/[0.08] transition-colors cursor-pointer">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
                    </svg>
                    Download Financial Outlook
                </button>
            </div>
        </motion.div>
    );
}
