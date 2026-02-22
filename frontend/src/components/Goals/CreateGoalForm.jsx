import { useState } from "react";
import { motion } from "framer-motion";
import { createGoal } from "../../services/goalsService";

export default function CreateGoalForm({ show, onClose, onCreated }) {
    const [form, setForm] = useState({
        type: "behavioral",
        targetValue: 85,
        horizon: "60D",
        riskTolerance: "moderate",
        aiSuggestions: true,
    });
    const [loading, setLoading] = useState(false);

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createGoal(form);
            setForm({ type: "behavioral", targetValue: 85, horizon: "60D", riskTolerance: "moderate", aiSuggestions: true });
            onCreated?.();
            onClose?.();
        } catch (err) {
            console.error("Create goal failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md rounded-2xl bg-[#12141A] border border-[#2D3139] p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold mb-4">Create New Goal</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type */}
                    <div>
                        <label className="text-[10px] font-semibold uppercase tracking-widest text-text-muted block mb-1.5">
                            Goal Type
                        </label>
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="w-full rounded-xl bg-white/[0.04] border border-[#2D3139] px-3 py-2 text-xs text-white outline-none focus:border-[#ec5b13]/50"
                        >
                            <option value="behavioral">Behavioral</option>
                            <option value="savings">Savings</option>
                            <option value="risk">Risk</option>
                        </select>
                    </div>

                    {/* Target */}
                    <div>
                        <label className="text-[10px] font-semibold uppercase tracking-widest text-text-muted block mb-1.5">
                            Target Value
                        </label>
                        <input
                            type="number"
                            value={form.targetValue}
                            onChange={(e) => setForm({ ...form, targetValue: Number(e.target.value) })}
                            className="w-full rounded-xl bg-white/[0.04] border border-[#2D3139] px-3 py-2 text-xs text-white outline-none focus:border-[#ec5b13]/50"
                        />
                    </div>

                    {/* Horizon */}
                    <div>
                        <label className="text-[10px] font-semibold uppercase tracking-widest text-text-muted block mb-1.5">
                            Time Horizon
                        </label>
                        <div className="flex gap-2">
                            {["30D", "60D", "90D"].map((h) => (
                                <button
                                    type="button"
                                    key={h}
                                    onClick={() => setForm({ ...form, horizon: h })}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer border ${form.horizon === h
                                            ? "bg-[#ec5b13] text-white border-[#ec5b13]"
                                            : "bg-white/[0.04] border-[#2D3139] text-text-muted hover:border-white/[0.12]"
                                        }`}
                                >
                                    {h}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Risk Tolerance */}
                    <div>
                        <label className="text-[10px] font-semibold uppercase tracking-widest text-text-muted block mb-1.5">
                            Risk Tolerance
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="2"
                            value={["low", "moderate", "aggressive"].indexOf(form.riskTolerance)}
                            onChange={(e) => setForm({ ...form, riskTolerance: ["low", "moderate", "aggressive"][e.target.value] })}
                            className="w-full accent-[#ec5b13]"
                        />
                        <div className="flex justify-between text-[9px] text-text-muted mt-1">
                            <span>Low</span><span>Moderate</span><span>Aggressive</span>
                        </div>
                    </div>

                    {/* AI Toggle */}
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                            AI Suggestions
                        </span>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, aiSuggestions: !form.aiSuggestions })}
                            className={`w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer ${form.aiSuggestions ? "bg-[#ec5b13]" : "bg-white/[0.08]"
                                }`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 m-0.5 ${form.aiSuggestions ? "translate-x-5" : ""
                                }`} />
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-xl bg-[#ec5b13] text-white text-xs font-bold hover:bg-[#ec5b13]/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating..." : "Create Goal"}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}
