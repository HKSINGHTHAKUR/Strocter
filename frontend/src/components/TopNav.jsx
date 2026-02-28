import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import SubscriptionStatusBadge from "./Pricing/SubscriptionStatusBadge";

export default function TopNav() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isPremium, isTrial, loading } = useSubscription();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    /* Close dropdown on outside click */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
        navigate("/login", { replace: true });
    };

    /* User initials for avatar */
    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    const displayName = user?.name || "User";

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

                {/* Profile + Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-xs font-semibold text-accent">
                            {initials}
                        </div>
                        <div className="hidden lg:flex items-center gap-2">
                            <div>
                                <p className="text-sm font-medium leading-tight text-left">{displayName}</p>
                                {!loading && <SubscriptionStatusBadge />}
                            </div>
                            {/* Chevron */}
                            <svg
                                className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-neutral-800 bg-neutral-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* User info (mobile) */}
                            <div className="px-4 py-2.5 border-b border-neutral-800 lg:hidden">
                                <p className="text-sm font-medium text-white">{displayName}</p>
                                <p className="text-[10px] text-neutral-500 mt-0.5">Strocter Account</p>
                            </div>

                            <button
                                onClick={() => { setDropdownOpen(false); navigate("/settings"); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/[0.04] hover:text-white transition-colors flex items-center gap-3"
                            >
                                <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.759 6.759 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </button>

                            <button
                                onClick={() => { setDropdownOpen(false); navigate("/pricing"); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/[0.04] hover:text-white transition-colors flex items-center gap-3"
                            >
                                <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                </svg>
                                Pricing
                            </button>

                            {/* Divider */}
                            <div className="h-px bg-neutral-800 my-1.5" />

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-3"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
