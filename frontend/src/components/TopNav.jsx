export default function TopNav() {
    return (
        <header className="topnav fixed top-0 left-[72px] right-0 z-20 flex items-center justify-between px-8">
            {/* Left: Search */}
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A5D6B" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder="Search psychological data..."
                    className="bg-transparent outline-none text-sm text-text-secondary placeholder-text-muted w-56"
                />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-5">
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
                    <div className="hidden lg:block">
                        <p className="text-sm font-medium leading-tight">Julian Sterling</p>
                        <p className="text-[10px] text-accent-orange font-medium uppercase tracking-wider">Premium User</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
