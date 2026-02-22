const SENSITIVITY_LABELS = ["Low", "Moderate", "High"];
const FRICTION_OPTIONS = ["minimal", "balanced", "aggressive"];

export default function AIModelControls({ aiControls, onChange }) {
    if (!aiControls) return null;

    const update = (key, val) => onChange({ ...aiControls, [key]: val });

    return (
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Left description */}
            <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#a855f7]">⚡</span>
                    <h2 className="text-base font-bold">AI Behavioral Model Controls</h2>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                    Configure how the predictive engine responds to user behavioral patterns and impulse triggers.
                </p>
            </div>

            {/* Right controls */}
            <div className="lg:col-span-3 rounded-2xl border border-[#2D3139] bg-[#12141A] p-6 space-y-6">
                {/* Impulse Sensitivity Slider */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold">Impulse Sensitivity Threshold</p>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#ec5b13] bg-[#ec5b13]/10 px-2 py-0.5 rounded-full">
                            {SENSITIVITY_LABELS[aiControls.impulseSensitivity]}
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={2}
                        step={1}
                        value={aiControls.impulseSensitivity}
                        onChange={(e) => update("impulseSensitivity", Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none bg-[#2D3139] accent-[#ec5b13] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-text-muted mt-1.5 font-semibold uppercase tracking-widest">
                        <span>Low</span><span>Moderate</span><span>High</span>
                    </div>
                </div>

                {/* Cognitive Friction + Predictive Risk */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Cognitive Friction */}
                    <div>
                        <p className="text-sm font-semibold mb-2">Cognitive Friction Level</p>
                        <div className="flex rounded-xl border border-[#2D3139] overflow-hidden">
                            {FRICTION_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => update("cognitiveFriction", opt)}
                                    className={`flex-1 py-2 text-[10px] font-semibold capitalize cursor-pointer transition-all duration-200 ${aiControls.cognitiveFriction === opt
                                            ? "bg-white/[0.1] text-white"
                                            : "text-text-muted hover:bg-white/[0.04]"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Predictive Risk Sensitivity */}
                    <div>
                        <p className="text-sm font-semibold mb-2">Predictive Risk Sensitivity</p>
                        <select
                            value={aiControls.predictiveRiskSensitivity}
                            onChange={(e) => update("predictiveRiskSensitivity", e.target.value)}
                            className="w-full rounded-xl bg-white/[0.04] border border-[#2D3139] px-3 py-2 text-xs text-white outline-none focus:border-[#ec5b13]/40 cursor-pointer capitalize"
                        >
                            {FRICTION_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Auto Adjustment Toggle */}
                <div className="flex items-center justify-between pt-2">
                    <div>
                        <p className="text-sm font-semibold">Behavioral Adjustment Automation</p>
                        <p className="text-[10px] text-text-muted mt-0.5">
                            Allow AI to auto-calibrate friction based on current stress levels.
                        </p>
                    </div>
                    <button
                        onClick={() => update("autoAdjustment", !aiControls.autoAdjustment)}
                        className={`w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer flex items-center ${aiControls.autoAdjustment ? "bg-[#ec5b13]" : "bg-[#2D3139]"
                            }`}
                    >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 mx-0.5 ${aiControls.autoAdjustment ? "translate-x-5" : ""
                            }`} />
                    </button>
                </div>
            </div>
        </section>
    );
}
