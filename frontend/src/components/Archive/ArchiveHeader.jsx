import { motion } from "framer-motion";

export default function ArchiveHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Reports & Intelligence Archive
                </h1>
                <p className="text-text-secondary text-sm mt-1">
                    Behavioral Financial Reports & Stability Documentation
                </p>
            </div>

            <div className="flex items-center gap-3">
                {/* Date range */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-[11px] text-text-muted">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold text-white">Oct 01, 2023–Oct 31, 2023</span>
                </div>

                {/* Export */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-xs font-semibold hover:bg-white/[0.08] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
                    </svg>
                    Export PDF
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Generate */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ec5b13] text-white text-xs font-semibold hover:bg-[#ec5b13]/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-[#ec5b13]/20">
                    Generate New Report
                </button>
            </div>
        </motion.div>
    );
}
