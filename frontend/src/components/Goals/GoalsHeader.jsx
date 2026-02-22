import { motion } from "framer-motion";

export default function GoalsHeader({ onCreateClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Goals & Behavioral Planning
                </h1>
                <p className="text-text-secondary text-sm mt-1 max-w-xl">
                    Define measurable targets. Adjust behavior. Improve long-term financial stability with institutional-grade logic.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-xs font-semibold hover:bg-white/[0.08] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Goal Filter
                </button>

                <button
                    onClick={onCreateClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ec5b13] text-white text-xs font-semibold hover:bg-[#ec5b13]/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-[#ec5b13]/20"
                >
                    <span className="text-sm">+</span>
                    Create New Goal
                </button>
            </div>
        </motion.div>
    );
}
