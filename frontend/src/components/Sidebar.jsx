import { NavLink } from "react-router-dom";

const SidebarIcon = ({ children }) => (
    <svg
        width="20"
        height="20"
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

const navItems = [
    {
        label: "Dashboard",
        to: "/dashboard",
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
        icon: (
            <SidebarIcon>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12M8 10h8M8 14h8" />
            </SidebarIcon>
        ),
    },
    {
        label: "Impulse AI",
        to: "/impulse-ai",
        icon: (
            <SidebarIcon>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </SidebarIcon>
        ),
    },
    {
        label: "Archive",
        to: "/archive",
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
        icon: (
            <SidebarIcon>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
            </SidebarIcon>
        ),
    },
];

export default function Sidebar() {
    return (
        <aside className="sidebar fixed left-0 top-0 h-screen z-30 flex flex-col items-center py-6 justify-between">
            <div className="flex flex-col items-center">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-sm">
                        S
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted mt-1">
                        Strocter
                    </span>
                </div>

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
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Settings at bottom */}
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
        </aside>
    );
}
