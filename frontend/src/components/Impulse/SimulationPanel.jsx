import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function SimulationPanel({ onSimulate, simResult, loading }) {
    const [friction, setFriction] = useState(65);
    const debounceRef = useRef(null);

    /* Animated count-up springs */
    const savingsSpring = useSpring(0, { stiffness: 80, damping: 20 });
    const riskSpring = useSpring(0, { stiffness: 80, damping: 20 });
    const stabilitySpring = useSpring(0, { stiffness: 80, damping: 20 });

    const savingsDisplay = useTransform(savingsSpring, (v) => `+$${Math.round(v).toLocaleString()}`);
    const riskDisplay = useTransform(riskSpring, (v) => `-${Math.round(v)}%`);
    const stabilityDisplay = useTransform(stabilitySpring, (v) => `${Math.round(v)}/100`);

    useEffect(() => {
        if (simResult) {
            savingsSpring.set(simResult.predictedSavings ?? 0);
            riskSpring.set(simResult.riskReduction ?? 0);
            stabilitySpring.set(simResult.stabilityForecast ?? 50);
        }
    }, [simResult, savingsSpring, riskSpring, stabilitySpring]);

    const handleSliderChange = useCallback(
        (e) => {
            const val = parseInt(e.target.value, 10);
            setFriction(val);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                onSimulate(val);
            }, 500);
        },
        [onSimulate]
    );

    /* Clean up */
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const getSliderLabel = () => {
        if (friction < 30) return "MINIMAL";
        if (friction < 70) return "OPTIMAL";
        return "RESTRICTIVE";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl border border-white/[0.08] bg-[#12141A] p-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
                <div>
                    <h3 className="text-sm font-semibold">
                        Behavioral Adjustment Simulation
                    </h3>
                    <p className="text-[10px] text-text-muted mt-0.5">
                        Adjust the friction variable to forecast long-term stability and financial impact.
                    </p>
                </div>
                <span className="text-[9px] font-mono px-2 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] text-text-muted">
                    MODEL::LAB-V4.2
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
                {/* Left: Slider */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold">
                            Cognitive Friction Variable
                        </span>
                        <span className="text-xs font-bold text-[#FF6A00]">
                            {friction}%
                        </span>
                    </div>

                    {/* Slider */}
                    <div className="relative">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={friction}
                            onChange={handleSliderChange}
                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #FF6A00 ${friction}%, rgba(255,255,255,0.06) ${friction}%)`,
                            }}
                        />
                    </div>

                    <div className="flex justify-between mt-1.5 text-[9px] text-text-muted uppercase tracking-wider">
                        <span>Minimal</span>
                        <span>Optimal</span>
                        <span>Restrictive</span>
                    </div>

                    {/* Insight quote */}
                    <div className="mt-5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <p className="text-[11px] text-text-muted italic leading-relaxed">
                            "Simulating higher friction during peak vulnerability windows
                            (23:30 - 02:15) shows a significant reduction in high-velocity
                            impulse events."
                        </p>
                    </div>
                </div>

                {/* Right: Results */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        {
                            label: "Predicted Savings",
                            spring: savingsDisplay,
                            sub: "Monthly projected impact",
                            color: "text-emerald-400",
                        },
                        {
                            label: "Risk Reduction",
                            spring: riskDisplay,
                            sub: "Probability of default",
                            color: "text-[#FF6A00]",
                        },
                        {
                            label: "Stability Forecast",
                            spring: stabilityDisplay,
                            sub: "Cognitive resilience index",
                            color: "text-[#6E33B1]",
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center"
                        >
                            <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted mb-2">
                                {item.label}
                            </p>
                            <motion.p className={`text-xl font-bold ${item.color}`}>
                                {item.spring}
                            </motion.p>
                            <p className="text-[9px] text-text-muted mt-1">
                                {item.sub}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
