import { useNavigate } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";
import SubscriptionStatusBadge from "./Pricing/SubscriptionStatusBadge";

export default function TopNav() {
    const navigate = useNavigate();
    const { isPremium, isTrial, loading } = useSubscription();

    return (
        <header className="topnav fixed top-0 left-[88px] right-0 z-20 flex items-center justify-between px-8">
            {/* Left: Brand */}
            <div className="flex items-center gap-3">
                <img src="/assets/logo.png" alt="Strocter" className="w-8 h-8 object-contain" />
                <span className="text-lg font-bold tracking-[0.25em] uppercase text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Strocter
                </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-5">
                {/* Upgrade button (only for free users after trial) */}
                {!loading && !isPremium && !isTrial && (
                    <button
                        onClick={() => navigate("/pricing")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ec5b13] text-white text-xs font-semibold hover:bg-[#ec5b13]/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#ec5b13]/25 cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Upgrade
                    </button>
                )}

                {/* Notification */}
                <button className="relative p-2 text-text-muted hover:text-white transition-colors cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-orange rounded-full" />
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-xs font-semibold text-accent">
                        JS
                    </div>
                    <div className="hidden lg:flex items-center gap-2">
                        <div>
                            <p className="text-sm font-medium leading-tight">Julian Sterling</p>
                            {!loading && <SubscriptionStatusBadge />}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
