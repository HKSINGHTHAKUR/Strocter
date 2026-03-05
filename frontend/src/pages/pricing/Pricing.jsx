import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";

// TEMPORARY: FREE FOR ALL — celebration pricing page

const ALL_FEATURES = [
    "Full Dashboard & Overview",
    "Unlimited Transaction Tracking",
    "Advanced Spending Metrics",
    "Full Behavioral Analytics",
    "Impulse AI Lab & Simulations",
    "Wealth & Stability Engine",
    "AI Strategy Memo",
    "Goals & Milestones",
    "PDF & CSV Report Export",
    "AI-Generated Reports",
    "Reports Archive",
    "Advanced Risk Governance",
    "Notification Protocols",
    "Priority Intelligence",
    "Strocter AI Chat",
];

export default function Pricing() {
    return (
        <div className="min-h-screen bg-[#0B0D10] text-white">
            <Sidebar />
            <TopNav />

            <main className="ml-[64px] pt-[72px] px-8 pb-16">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center pt-12 pb-16"
                >
                    {/* Celebration badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
                    >
                        <span className="text-lg">🎉</span>
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                            Limited Time — Everything Free
                        </span>
                    </motion.div>

                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                        All Features,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#ec5b13]">
                            Zero Cost
                        </span>
                    </h1>
                    <p className="text-text-muted text-base max-w-xl mx-auto leading-relaxed">
                        We're opening up the entire Strocter Intelligence Suite for free during our
                        early-access period. Enjoy every premium feature — no strings attached.
                    </p>
                </motion.div>

                {/* Single unified card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-lg mx-auto mb-20"
                >
                    <div className="relative rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.04] to-transparent p-8 shadow-lg shadow-emerald-500/5">
                        {/* Badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="px-4 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/30">
                                Early Access
                            </span>
                        </div>

                        {/* Price */}
                        <div className="text-center mb-2 mt-2">
                            <h3 className="text-lg font-bold mb-1">Full Intelligence Suite</h3>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-4xl font-bold text-emerald-400">₹0</span>
                                <span className="text-text-muted text-sm line-through">₹499/mo</span>
                            </div>
                        </div>

                        <div className="h-px bg-white/[0.06] my-6" />

                        {/* Features grid */}
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                            {ALL_FEATURES.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-sm">
                                    <svg className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-text-secondary">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <button
                            disabled
                            className="w-full py-3 rounded-xl font-semibold text-sm bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 cursor-default"
                        >
                            ✦ You Have Full Access
                        </button>
                    </div>
                </motion.div>

                {/* Coming soon note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center py-12 max-w-lg mx-auto"
                >
                    <div className="rounded-2xl border border-white/[0.06] bg-[#12141A] p-8">
                        <div className="w-10 h-10 rounded-xl bg-[#ec5b13]/10 border border-[#ec5b13]/20 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-5 h-5 text-[#ec5b13]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold mb-2">Paid Plans Coming Soon</h3>
                        <p className="text-text-muted text-sm leading-relaxed">
                            We're building something incredible. Enjoy unlimited access now —
                            paid tiers with even more features will be introduced later.
                            Early users may receive special perks.
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
