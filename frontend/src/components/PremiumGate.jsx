import { useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import UpgradeModal from "../components/Pricing/UpgradeModal";

/**
 * Wraps a premium page. If user is free + trial expired,
 * shows the page with a blocking UpgradeModal overlay.
 */
export default function PremiumGate({ children }) {
    const { isPremium, isTrial, loading } = useSubscription();
    const [dismissed, setDismissed] = useState(false);

    // While loading or user has access, render the page normally
    if (loading || isPremium || isTrial) {
        return children;
    }

    // Free user with expired trial
    return (
        <>
            {/* Render the page underneath (blurred) for visual context */}
            <div className="pointer-events-none opacity-30 blur-sm select-none">
                {children}
            </div>

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={!dismissed}
                onClose={() => setDismissed(true)}
            />

            {/* Persistent upgrade bar after dismissing modal */}
            {dismissed && (
                <div className="fixed bottom-0 left-[88px] right-0 z-50 bg-[#12141A] border-t border-[#ec5b13]/20 px-8 py-4 flex items-center justify-between">
                    <p className="text-sm text-text-muted">
                        <span className="text-[#ec5b13] font-semibold">Premium feature.</span>{" "}
                        Upgrade to unlock full access to this page.
                    </p>
                    <a
                        href="/pricing"
                        className="px-5 py-2 rounded-xl bg-[#ec5b13] text-white text-xs font-semibold hover:bg-[#ec5b13]/90 transition-all shadow-lg shadow-[#ec5b13]/20"
                    >
                        Upgrade for ₹1
                    </a>
                </div>
            )}
        </>
    );
}
