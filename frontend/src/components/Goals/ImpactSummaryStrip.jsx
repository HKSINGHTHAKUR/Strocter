import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedValue({ value, prefix = "" }) {
    const [display, setDisplay] = useState(value);
    useEffect(() => { setDisplay(value); }, [value]);
    return <span>{prefix}{display}</span>;
}

export default function ImpactSummaryStrip({ impact }) {
    if (!impact) return null;

    const items = [
        { label: "Projected Savings", value: impact.projectedSavings, color: "text-emerald-400" },
        { label: "Risk Reduction", value: impact.riskReduction, color: "text-[#6E33B1]" },
        { label: "Stability Forecast", value: impact.stabilityForecast, color: impact.stabilityForecast === "Positive" ? "text-emerald-400" : "text-[#ec5b13]" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl border border-[#2D3139] bg-[#12141A] p-5"
        >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {items.map((item, i) => (
                    <div key={item.label} className="text-center">
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted mb-1">
                            {item.label}
                        </p>
                        <p className={`text-xl font-bold ${item.color}`}>
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
