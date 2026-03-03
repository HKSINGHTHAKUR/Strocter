import { motion } from "framer-motion";

// TEMPORARY: FREE FOR ALL — single-column, all features included

const ALL_FEATURES = [
    "Dashboard & Overview",
    "Transaction Tracking",
    "Basic Metrics",
    "Behavioral Analytics",
    "Impulse AI Lab",
    "Wealth & Stability Engine",
    "Goals & AI Memo",
    "Reports Archive",
    "PDF Report Generation",
    "CSV Data Export",
    "AI Simulation Engine",
    "Risk Governance",
    "Advanced Notifications",
    "Priority Support",
    "Unlimited Transactions",
];

const Check = () => (
    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export default function FeatureComparisonTable() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <h2 className="text-xl font-bold text-center mb-2">All Features Included</h2>
            <p className="text-text-muted text-sm text-center mb-8">
                Every feature is free during early access — no restrictions.
            </p>

            <div className="rounded-2xl border border-white/[0.06] bg-[#12141A] overflow-hidden max-w-xl mx-auto">
                {/* Header */}
                <div className="grid grid-cols-2 gap-4 px-6 py-4 bg-white/[0.02] border-b border-white/[0.06]">
                    <div className="text-xs font-bold uppercase tracking-widest text-text-muted">Feature</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 text-center">All Users</div>
                </div>

                {/* Rows */}
                {ALL_FEATURES.map((feature, i) => (
                    <div
                        key={i}
                        className={`grid grid-cols-2 gap-4 px-6 py-3.5 ${i < ALL_FEATURES.length - 1 ? "border-b border-white/[0.03]" : ""
                            } hover:bg-white/[0.02] transition-colors`}
                    >
                        <div className="text-sm text-text-secondary">{feature}</div>
                        <div className="flex justify-center"><Check /></div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
