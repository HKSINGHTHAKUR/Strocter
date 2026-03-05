import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";

/* ── Icon wrapper ── */
const SidebarIcon = ({ children }) => (
    <div className="sidebar-icon">
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {children}
        </svg>
    </div>
);

/* ── Lock badge for premium items ── */
const LockBadge = ({ collapsed }) => (
    !collapsed ? (
        <svg className="sidebar-lock" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
    ) : null
);

/* ── Tooltip (collapsed mode) ── */
const Tooltip = ({ label, visible }) => (
    <div
        className="sidebar-tooltip"
        style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
    >
        {label}
    </div>
);

/* ── Hamburger toggle button ── */
const HamburgerToggle = ({ collapsed, onClick }) => (
    <button
        onClick={onClick}
        className="sidebar-toggle"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
        <div className={`sidebar-hamburger ${collapsed ? "" : "open"}`}>
            <span /><span /><span />
        </div>
    </button>
);

/* ── Navigation items config ── */
const navItems = [
    {
        label: "Dashboard", to: "/dashboard", premium: false,
        iconChildren: (
            <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>
        ),
    },
    {
        label: "Transactions", to: "/transactions", premium: false,
        iconChildren: (
            <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></>
        ),
    },
    {
        label: "Analytics", to: "/analytics", premium: true,
        iconChildren: (
            <><path d="M3 3v18h18" /><path d="M7 16l4-6 4 4 5-8" /></>
        ),
    },
    {
        label: "Wealth", to: "/wealth", premium: true,
        iconChildren: (
            <><circle cx="12" cy="12" r="10" /><path d="M12 6v12M8 10h8M8 14h8" /></>
        ),
    },
    {
        label: "Archive", to: "/archive", premium: true,
        iconChildren: (
            <><path d="M21 8v13H3V8" /><path d="M1 3h22v5H1z" /><path d="M10 12h4" /></>
        ),
    },
    {
        label: "Goals", to: "/goals", premium: true,
        iconChildren: (
            <><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></>
        ),
    },
];

const bottomItems = [
    {
        label: "Pricing", to: "/pricing", premium: false, isUpgrade: true,
        iconChildren: (
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        ),
    },
    {
        label: "Settings", to: "/settings", premium: false,
        iconChildren: (
            <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></>
        ),
    },
];

/* ── Sidebar Item ── */
function SidebarItem({ item, collapsed, hasFullAccess, loading, activeIndex, itemIndex }) {
    const [hovered, setHovered] = useState(false);

    const upgradeLabel = item.isUpgrade && !hasFullAccess && !loading;

    return (
        <NavLink
            to={item.to}
            className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""} ${upgradeLabel ? "upgrade-glow" : ""}`
            }
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <SidebarIcon>{item.iconChildren}</SidebarIcon>
            {!collapsed && (
                <span className="sidebar-label">
                    {item.isUpgrade && !hasFullAccess && !loading ? "Upgrade" : item.label}
                </span>
            )}
            {!collapsed && !loading && item.premium && !hasFullAccess && (
                <LockBadge collapsed={collapsed} />
            )}
            {collapsed && <Tooltip label={item.label} visible={hovered} />}
        </NavLink>
    );
}

/* ── Main Sidebar ── */
export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(true);
    const { isPremium, isTrial, loading } = useSubscription();
    const hasFullAccess = isPremium || isTrial;
    const location = useLocation();
    const navRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({});

    // All items combined for index tracking
    const allItems = [...navItems, ...bottomItems];

    // Find active index
    const activeIndex = allItems.findIndex((item) => location.pathname.startsWith(item.to));

    // Floating indicator position
    useEffect(() => {
        if (navRef.current && activeIndex >= 0) {
            const items = navRef.current.querySelectorAll(".sidebar-item");
            const activeEl = items[activeIndex];
            if (activeEl) {
                const containerRect = navRef.current.getBoundingClientRect();
                const itemRect = activeEl.getBoundingClientRect();
                setIndicatorStyle({
                    top: itemRect.top - containerRect.top,
                    height: itemRect.height,
                });
            }
        }
    }, [activeIndex, collapsed, location.pathname]);

    const sidebarWidth = collapsed ? 64 : 240;

    return (
        <aside
            className="sidebar-root"
            style={{ width: sidebarWidth }}
        >
            {/* Toggle */}
            <div className="sidebar-header">
                <HamburgerToggle collapsed={collapsed} onClick={() => setCollapsed(!collapsed)} />
                {!collapsed && (
                    <span className="sidebar-brand">STROCTER</span>
                )}
            </div>

            {/* Navigation container — holds the floating indicator */}
            <div className="sidebar-nav-wrapper" ref={navRef}>
                {/* Floating active indicator */}
                {activeIndex >= 0 && (
                    <div
                        className="sidebar-float-indicator"
                        style={{
                            transform: `translateY(${indicatorStyle.top || 0}px)`,
                            height: indicatorStyle.height || 40,
                        }}
                    />
                )}

                {/* Main nav items */}
                <nav className="sidebar-nav-main">
                    {navItems.map((item, i) => (
                        <SidebarItem
                            key={item.label}
                            item={item}
                            collapsed={collapsed}
                            hasFullAccess={hasFullAccess}
                            loading={loading}
                            activeIndex={activeIndex}
                            itemIndex={i}
                        />
                    ))}
                </nav>

                {/* Bottom nav items */}
                <nav className="sidebar-nav-bottom">
                    {bottomItems.map((item, i) => (
                        <SidebarItem
                            key={item.label}
                            item={item}
                            collapsed={collapsed}
                            hasFullAccess={hasFullAccess}
                            loading={loading}
                            activeIndex={activeIndex}
                            itemIndex={navItems.length + i}
                        />
                    ))}
                </nav>
            </div>
        </aside>
    );
}
