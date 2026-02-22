export default function SettingsHeader({ onSave, onReset, saving, hasChanges }) {
    return (
        <div className="sticky top-0 z-20 bg-[#0E1117]/95 backdrop-blur-md border-b border-[#2D3139] px-10 py-5 -mx-10 -mt-8 mb-6">
            <div className="flex items-center justify-between max-w-[1400px] mx-auto">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        System Configuration & Intelligence Settings
                    </h1>
                    <p className="text-text-secondary text-sm mt-0.5">
                        Manage behavioral models, risk thresholds, security layers, and system preferences.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onReset}
                        className="px-5 py-2 rounded-xl border border-[#2D3139] bg-white/[0.04] text-xs font-semibold text-white hover:bg-white/[0.08] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    >
                        Reset Defaults
                    </button>
                    <button
                        onClick={onSave}
                        disabled={saving || !hasChanges}
                        className="px-5 py-2 rounded-xl bg-[#ec5b13] text-white text-xs font-bold hover:bg-[#ec5b13]/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-[#ec5b13]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
