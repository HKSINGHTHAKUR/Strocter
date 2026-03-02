import { NavLink, useNavigate } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";

const SidebarIcon = ({ children }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {children}
    </svg>
);

const LockBadge = () => (
    <svg className="w-3 h-3 text-[#ec5b13] opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const navItems = [
    {
        label: "Dashboard",
        to: "/dashboard",
        premium: false,
        icon: (
            <SidebarIcon>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </SidebarIcon>
        ),
    },
    {
        label: "Transactions",
        to: "/transactions",
        premium: false,
        icon: (
            <SidebarIcon>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
            </SidebarIcon>
        ),
    },
    {
        label: "Analytics",
        to: "/analytics",
        premium: true,
        icon: (
            <SidebarIcon>
                <path d="M3 3v18h18" />
                <path d="M7 16l4-6 4 4 5-8" />
            </SidebarIcon>
        ),
    },
    {
        label: "Wealth",
        to: "/wealth",
        premium: true,
        icon: (
            <SidebarIcon>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12M8 10h8M8 14h8" />
            </SidebarIcon>
        ),
    },
    {
        label: "Archive",
        to: "/archive",
        premium: true,
        icon: (
            <SidebarIcon>
                <path d="M21 8v13H3V8" />
                <path d="M1 3h22v5H1z" />
                <path d="M10 12h4" />
            </SidebarIcon>
        ),
    },
    {
        label: "Goals",
        to: "/goals",
        premium: true,
        icon: (
            <SidebarIcon>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
            </SidebarIcon>
        ),
    },
    {
        label: "Strocter AI",
        to: "/strocter-ai",
        premium: true,
        icon: (
            <SidebarIcon>
                <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                <path d="M10 21h4" />
                <path d="M9 17h6" />
            </SidebarIcon>
        ),
    },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const { isPremium, isTrial, loading } = useSubscription();
    const hasFullAccess = isPremium || isTrial;

    return (
        <aside className="sidebar fixed left-0 top-0 h-screen z-30 flex flex-col items-center py-6 justify-between">
            <div className="flex flex-col items-center pt-8">
                {/* Nav Items */}
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) =>
                                `sidebar-item ${isActive ? "active" : ""}`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            {/* Lock badge on premium items for free users */}
                            {!loading && item.premium && !hasFullAccess && <LockBadge />}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="flex flex-col items-center gap-2">
                {/* Pricing / Upgrade */}
                <NavLink
                    to="/pricing"
                    className={({ isActive }) =>
                        `sidebar-item ${isActive ? "active" : ""} ${!hasFullAccess && !loading ? "text-[#ec5b13]" : ""}`
                    }
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    <span>{!loading && hasFullAccess ? "Pricing" : "Upgrade"}</span>
                </NavLink>

                {/* Settings */}
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `sidebar-item ${isActive ? "active" : ""}`
                    }
                >
                    <SidebarIcon>
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                    </SidebarIcon>
                    <span>Settings</span>
                </NavLink>
            </div>
        </aside >
    );
}
