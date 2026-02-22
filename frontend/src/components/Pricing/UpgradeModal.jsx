import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSubscription } from "../../context/SubscriptionContext";

export default function UpgradeModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { plan } = useSubscription();

    if (!isOpen || plan === "premium") return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center"
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative z-10 w-full max-w-md mx-4"
                >
                    <div className="rounded-2xl border border-white/[0.08] bg-[#12141A] p-8 shadow-2xl">
                        {/* Lock Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-[#ec5b13]/10 border border-[#ec5b13]/20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-[#ec5b13]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-center mb-2">
                            Premium Feature
                        </h3>
                        <p className="text-text-muted text-sm text-center mb-6 leading-relaxed">
                            This feature requires a Premium subscription. Unlock full access to
                            Behavioral Analytics, AI Simulations, Reports, and more.
                        </p>

                        {/* Price */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-[#ec5b13]">₹1</span>
                                <span className="text-text-muted text-sm">/month</span>
                            </div>
                            <p className="text-[10px] text-[#ec5b13] font-semibold uppercase tracking-wider mt-1">
                                Launch Offer
                            </p>
                        </div>

                        {/* CTA */}
                        <button
                            onClick={() => {
                                onClose();
                                navigate("/pricing");
                            }}
                            className="w-full py-3 rounded-xl bg-[#ec5b13] text-white font-semibold text-sm hover:bg-[#ec5b13]/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ec5b13]/25 cursor-pointer"
                        >
                            Upgrade for ₹1
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-2.5 mt-3 rounded-xl text-text-muted text-xs font-medium hover:text-white transition-colors cursor-pointer"
                        >
                            Maybe Later
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
