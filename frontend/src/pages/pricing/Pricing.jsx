import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import PricingCard from "../../components/Pricing/PricingCard";
import FeatureComparisonTable from "../../components/Pricing/FeatureComparisonTable";
import { useSubscription } from "../../context/SubscriptionContext";
import { createIntroOrder, confirmPayment } from "../../services/subscriptionService";

const FREE_FEATURES = [
    { label: "Basic Dashboard", included: true },
    { label: "Transaction Tracking", included: true },
    { label: "Basic Spending Metrics", included: true },
    { label: "Behavioral Analytics", included: false },
    { label: "Impulse AI Lab", included: false },
    { label: "Wealth & Stability Engine", included: false },
    { label: "AI Reports & Export", included: false },
    { label: "Goals & AI Strategy", included: false },
    { label: "PDF & CSV Downloads", included: false },
    { label: "Priority Intelligence", included: false },
];

const PREMIUM_FEATURES = [
    { label: "Full Behavioral Analytics", included: true },
    { label: "Impulse AI Lab & Simulations", included: true },
    { label: "Wealth & Stability Engine", included: true },
    { label: "PDF & CSV Report Export", included: true },
    { label: "AI-Generated Reports", included: true },
    { label: "AI Strategy Memo", included: true },
    { label: "Advanced Risk Governance", included: true },
    { label: "Notification Protocols", included: true },
    { label: "Priority Intelligence", included: true },
    { label: "Unlimited Transactions", included: true },
];

export default function Pricing() {
    const navigate = useNavigate();
    const { plan, isPremium, isTrial, trialDaysLeft, refresh } = useSubscription();
    const [upgrading, setUpgrading] = useState(false);

    const handleUpgrade = async () => {
        setUpgrading(true);
        try {
            // Step 1: Create order
            const order = await createIntroOrder();

            // Step 2: In production, launch Razorpay here with order.orderId
            // For now (pre-Razorpay): simulate payment confirmation
            await confirmPayment({
                paymentId: order.orderId,
                provider: "razorpay",
            });

            // Step 3: Refresh subscription state
            await refresh();
            navigate("/dashboard");
        } catch (err) {
            console.error("Upgrade error:", err);
            alert("Upgrade failed. Please try again.");
        } finally {
            setUpgrading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0D10] text-white">
            <Sidebar />
            <TopNav />

            <main className="ml-[88px] pt-[72px] px-8 pb-16">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center pt-12 pb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ec5b13]/10 border border-[#ec5b13]/20 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ec5b13] animate-pulse" />
                        <span className="text-[11px] font-semibold text-[#ec5b13] uppercase tracking-wider">
                            Choose Your Intelligence Tier
                        </span>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                        Unlock Full
                        <span className="text-[#ec5b13]"> Financial Intelligence</span>
                    </h1>
                    <p className="text-text-muted text-base max-w-xl mx-auto leading-relaxed">
                        Get complete access to Behavioral Analytics, AI Simulations,
                        Wealth Engine, and comprehensive reporting tools.
                    </p>

                    {/* Trial Banner */}
                    {isTrial && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                        >
                            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-emerald-400 font-medium">
                                Free trial active — <strong>{trialDaysLeft} days</strong> remaining
                            </span>
                        </motion.div>
                    )}
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-20">
                    <PricingCard
                        plan="Free"
                        price="₹0"
                        period="/forever"
                        features={FREE_FEATURES}
                        ctaText="Current Plan"
                        isCurrentPlan={plan === "free" && !isTrial}
                        onCta={() => { }}
                    />
                    <PricingCard
                        plan="Premium"
                        price="₹1"
                        period="/month"
                        features={PREMIUM_FEATURES}
                        badge="Launch Offer"
                        isPopular
                        ctaText={upgrading ? "Processing..." : "Upgrade Now"}
                        isCurrentPlan={isPremium}
                        disabled={upgrading}
                        onCta={handleUpgrade}
                    />
                </div>

                {/* Feature Comparison */}
                <div className="mb-20">
                    <FeatureComparisonTable />
                </div>

                {/* Bottom CTA */}
                {!isPremium && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-center py-16 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#ec5b13]/[0.04] to-transparent max-w-3xl mx-auto"
                    >
                        <h2 className="text-2xl font-bold mb-3">
                            Ready to Unlock Full Intelligence?
                        </h2>
                        <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
                            Introductory offer at ₹1. Get 30 days of full access to every premium feature.
                        </p>
                        <button
                            onClick={handleUpgrade}
                            disabled={upgrading}
                            className="px-8 py-3 rounded-xl bg-[#ec5b13] text-white font-semibold text-sm hover:bg-[#ec5b13]/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#ec5b13]/25 cursor-pointer disabled:opacity-50"
                        >
                            {upgrading ? "Processing..." : "Upgrade for ₹1"}
                        </button>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
