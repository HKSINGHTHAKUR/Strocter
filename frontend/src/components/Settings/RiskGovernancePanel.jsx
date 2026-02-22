export default function RiskGovernancePanel({ riskGovernance, onChange }) {
    if (!riskGovernance) return null;

    const update = (key, val) => onChange({ ...riskGovernance, [key]: val });
    const updateWeight = (cat, val) => {
        const weights = { ...riskGovernance.categoryWeights, [cat]: Number(val) };
        const total = weights.leisure + weights.essentials + weights.enterprise || 1;
        onChange({
            ...riskGovernance,
            categoryWeights: {
                leisure: Math.round((weights.leisure / total) * 100),
                essentials: Math.round((weights.essentials / total) * 100),
                enterprise: Math.round((weights.enterprise / total) * 100),
            },
        });
    };

    const weights = riskGovernance.categoryWeights || { leisure: 40, essentials: 15, enterprise: 45 };

    return (
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#ec5b13]">🛡</span>
                    <h2 className="text-base font-bold">Risk Exposure Governance</h2>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                    Define administrative boundaries and transaction limits for institutional safety protocols.
                </p>
            </div>

            <div className="lg:col-span-3 rounded-2xl border border-[#2D3139] bg-[#12141A] p-6 space-y-6">
                {/* Threshold + Lock window */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <p className="text-sm font-semibold mb-2">High-Risk Transaction Threshold</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={riskGovernance.highRiskThreshold}
                                onChange={(e) => update("highRiskThreshold", Math.max(1, Math.min(100, Number(e.target.value))))}
                                className="flex-1 rounded-xl bg-white/[0.04] border border-[#2D3139] px-3 py-2.5 text-sm text-white outline-none focus:border-[#ec5b13]/40 font-semibold"
                            />
                            <span className="text-text-muted text-xs">%</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold mb-2">Budget Lock Time Window</p>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 flex-1 rounded-xl bg-white/[0.04] border border-[#2D3139] px-3 py-2.5">
                                <input
                                    type="time"
                                    value={riskGovernance.lockStartTime}
                                    onChange={(e) => update("lockStartTime", e.target.value)}
                                    className="bg-transparent text-xs text-white outline-none flex-1"
                                />
                                <span className="text-text-muted text-[10px]">🕐</span>
                            </div>
                            <span className="text-text-muted text-xs">—</span>
                            <div className="flex items-center gap-1.5 flex-1 rounded-xl bg-white/[0.04] border border-[#2D3139] px-3 py-2.5">
                                <input
                                    type="time"
                                    value={riskGovernance.lockEndTime}
                                    onChange={(e) => update("lockEndTime", e.target.value)}
                                    className="bg-transparent text-xs text-white outline-none flex-1"
                                />
                                <span className="text-text-muted text-[10px]">🕐</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Weights */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold">Category Risk Weight</p>
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-text-muted">Weight Allocation Index</span>
                    </div>

                    {[
                        { key: "leisure", label: "Leisure", color: "#ec5b13" },
                        { key: "essentials", label: "Essentials", color: "#10b981" },
                        { key: "enterprise", label: "Enterprise", color: "#a855f7" },
                    ].map((cat) => (
                        <div key={cat.key} className="flex items-center gap-4 mb-3">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted w-24">{cat.label}</span>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={weights[cat.key]}
                                onChange={(e) => updateWeight(cat.key, e.target.value)}
                                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                                style={{ accentColor: cat.color, background: `linear-gradient(to right, ${cat.color} ${weights[cat.key]}%, #2D3139 ${weights[cat.key]}%)` }}
                            />
                            <span className="text-xs font-bold w-10 text-right" style={{ color: cat.color }}>
                                {weights[cat.key]}%
                            </span>
                        </div>
                    ))}
                </div>

                {/* Late Night Auto-Control */}
                <div className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-[#2D3139] p-4">
                    <div className="flex items-center gap-3">
                        <span className="text-lg">🌙</span>
                        <div>
                            <p className="text-sm font-semibold">Late-Night Spending Auto-Control</p>
                            <p className="text-[10px] text-text-muted mt-0.5">
                                Automatically freeze high-weight categories during off-hours.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => update("lateNightAutoControl", !riskGovernance.lateNightAutoControl)}
                        className={`w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer flex items-center ${riskGovernance.lateNightAutoControl ? "bg-[#ec5b13]" : "bg-[#2D3139]"
                            }`}
                    >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 mx-0.5 ${riskGovernance.lateNightAutoControl ? "translate-x-5" : ""
                            }`} />
                    </button>
                </div>
            </div>
        </section>
    );
}
