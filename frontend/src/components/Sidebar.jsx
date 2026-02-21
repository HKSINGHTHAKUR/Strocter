const SidebarIcon = ({ children }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

const items = [
    {
        label: "Home",
        icon: <SidebarIcon><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /></SidebarIcon>,
        active: true,
    },
    {
        label: "Analytics",
        icon: <SidebarIcon><path d="M3 3v18h18" /><path d="M7 16l4-6 4 4 5-8" /></SidebarIcon>,
    },
    {
        label: "Cards",
        icon: <SidebarIcon><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></SidebarIcon>,
    },
    {
        label: "Settings",
        icon: <SidebarIcon><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></SidebarIcon>,
    },
];

export default function Sidebar() {
    return (
        <aside className="sidebar fixed left-0 top-0 h-screen z-30 flex flex-col items-center py-6">
            {/* Logo */}
            <div className="mb-10">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">
                    S
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-2">
                {items.map((item) => (
                    <div key={item.label} className={`sidebar-item ${item.active ? "active" : ""}`}>
                        {item.icon}
                        <span>{item.label}</span>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
