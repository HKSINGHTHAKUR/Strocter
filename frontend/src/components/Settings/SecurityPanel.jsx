const TIMEOUT_OPTIONS = [
    { value: "15m", label: "15 minutes" },
    { value: "30m", label: "30 minutes" },
    { value: "1h", label: "1 hour" },
    { value: "4h", label: "4 hours" },
    { value: "24h", label: "24 hours" },
];

export default function SecurityPanel({ security, onChange }) {
    if (!security) return null;

    const update = (key, val) => onChange({ ...security, [key]: val });

    return (
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#10b981]">🔒</span>
                    <h2 className="text-base font-bold">Security & Data Governance</h2>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                    Manage encryption keys, session lifetimes, and biometric verification parameters.
                </p>
            </div>

            <div className="lg:col-span-3 rounded-2xl border border-[#2D3139] bg-[#12141A] p-6 space-y-5">
                {/* 2FA + Biometric row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* 2FA */}
                    <div className="rounded-xl border border-[#2D3139] bg-white/[0.02] p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted">2FA Status</p>
                            <span className="text-[10px] font-semibold text-[#10b981] cursor-pointer hover:underline">Manage</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${security.twoFAEnabled ? "bg-[#10b981]" : "bg-[#2D3139]"}`} />
                            <p className="text-xs font-semibold">
                                {security.twoFAEnabled ? "Active & Verified" : "Disabled"}
                            </p>
                        </div>
                    </div>

                    {/* Biometric */}
                    <div className="rounded-xl border border-[#2D3139] bg-white/[0.02] p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-1">Biometric Access</p>
                                <p className="text-xs font-semibold">FaceID / TouchID</p>
                            </div>
                            <button
                                onClick={() => update("biometricEnabled", !security.biometricEnabled)}
                                className={`w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer flex items-center ${security.biometricEnabled ? "bg-[#ec5b13]" : "bg-[#2D3139]"
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 mx-0.5 ${security.biometricEnabled ? "translate-x-5" : ""
                                    }`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Session Timeout */}
                <div>
                    <p className="text-sm font-semibold mb-2">Session Timeout Duration</p>
                    <div className="flex gap-2 flex-wrap">
                        {TIMEOUT_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => update("sessionTimeout", opt.value)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition-all duration-200 cursor-pointer ${security.sessionTimeout === opt.value
                                        ? "bg-[#ec5b13]/10 border-[#ec5b13]/30 text-[#ec5b13]"
                                        : "border-[#2D3139] text-text-muted hover:border-white/[0.12]"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
