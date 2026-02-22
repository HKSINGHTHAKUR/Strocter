import { motion } from "framer-motion";

const FEATURES = [
    { feature: "Dashboard & Overview", free: true, premium: true },
    { feature: "Transaction Tracking", free: true, premium: true },
    { feature: "Basic Metrics", free: true, premium: true },
    { feature: "Behavioral Analytics", free: false, premium: true },
    { feature: "Impulse AI Lab", free: false, premium: true },
    { feature: "Wealth & Stability Engine", free: false, premium: true },
    { feature: "Goals & AI Memo", free: false, premium: true },
    { feature: "Reports Archive", free: false, premium: true },
    { feature: "PDF Report Generation", free: false, premium: true },
    { feature: "CSV Data Export", free: false, premium: true },
    { feature: "AI Simulation Engine", free: false, premium: true },
    { feature: "Risk Governance", free: false, premium: true },
    { feature: "Advanced Notifications", free: false, premium: true },
    { feature: "Priority Support", free: false, premium: true },
    { feature: "Unlimited Transactions", free: false, premium: true },
];

const Check = () => (
    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const Cross = () => (
    <svg className="w-4 h-4 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default function FeatureComparisonTable() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <h2 className="text-xl font-bold text-center mb-8">Feature Comparison</h2>

            <div className="rounded-2xl border border-white/[0.06] bg-[#12141A] overflow-hidden max-w-3xl mx-auto">
                {/* Header */}
                <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-white/[0.02] border-b border-white/[0.06]">
                    <div className="text-xs font-bold uppercase tracking-widest text-text-muted">Feature</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-text-muted text-center">Free</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#ec5b13] text-center">Premium</div>
                </div>

                {/* Rows */}
                {FEATURES.map((row, i) => (
                    <div
                        key={i}
                        className={`grid grid-cols-3 gap-4 px-6 py-3.5 ${i < FEATURES.length - 1 ? "border-b border-white/[0.03]" : ""
                            } hover:bg-white/[0.02] transition-colors`}
                    >
                        <div className="text-sm text-text-secondary">{row.feature}</div>
                        <div className="flex justify-center">{row.free ? <Check /> : <Cross />}</div>
                        <div className="flex justify-center">{row.premium ? <Check /> : <Cross />}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
