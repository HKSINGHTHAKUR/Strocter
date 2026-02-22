export default function ArchiveFooter() {
    return (
        <footer className="mt-12 py-6 border-t border-white/[0.04]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#ec5b13] flex items-center justify-center text-[9px] font-bold text-white">S</span>
                    <span className="text-[11px] font-semibold text-text-muted">Strocter</span>
                </div>

                <p className="text-[9px] text-text-muted uppercase tracking-widest">
                    Generated using Strocter Behavioral Intelligence Engine v4.2
                </p>

                <div className="flex items-center gap-4 text-[10px] text-text-muted">
                    <span className="hover:text-white transition-colors cursor-pointer">Terms of Governance</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Privacy & Legal</span>
                </div>
            </div>
        </footer>
    );
}
