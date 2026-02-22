import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

/* ── Risk-based styling maps ── */

const INTENT_STYLES = {
    LOGICAL: "bg-emerald-500/12 text-emerald-400 border border-emerald-500/20",
    IMPULSE: "bg-orange-500/12 text-orange-400 border border-orange-500/20",
    INVESTMENT: "bg-accent-purple/12 text-accent-purple border border-accent-purple/20",
    EMOTIONAL: "bg-red-500/12 text-red-400 border border-red-500/20",
};

const RISK_ACCENT = {
    High: {
        bar: "bg-orange-500",
        glow: "shadow-[0_0_20px_rgba(249,115,22,0.25)]",
        hoverGlow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.35)]",
    },
    Medium: {
        bar: "bg-accent-purple",
        glow: "shadow-[0_0_20px_rgba(110,51,177,0.2)]",
        hoverGlow: "group-hover:shadow-[0_0_30px_rgba(110,51,177,0.3)]",
    },
    Low: {
        bar: "bg-emerald-500",
        glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
        hoverGlow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]",
    },
};

/* ── Value formatter ── */
const formatValue = (value) => {
    if (value == null) return "—";
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    });
    return formatter.format(Math.abs(value));
};

/* ── Clamp utility ── */
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

export default function IntelligenceCard({ item, index }) {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const rafRef = useRef(null);

    const riskLevel = item.impactLevel ?? "Low";
    const riskStyle = RISK_ACCENT[riskLevel] ?? RISK_ACCENT.Low;
    const intentKey = (item.psychologicalIntent ?? "").toUpperCase();
    const intentStyle = INTENT_STYLES[intentKey] ?? "bg-white/[0.06] text-text-secondary border border-white/[0.06]";

    /* ── Mouse tilt handler ── */
    const handleMouseMove = useCallback((e) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        rafRef.current = requestAnimationFrame(() => {
            if (!cardRef.current) return;
            const rect = cardRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const percentX = (e.clientX - centerX) / (rect.width / 2);
            const percentY = (e.clientY - centerY) / (rect.height / 2);

            setTilt({
                x: clamp(-percentY * 6, -6, 6),
                y: clamp(percentX * 6, -6, 6),
            });
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setTilt({ x: 0, y: 0 });
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.06 }}
            className="perspective-[1200px]"
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-all duration-300 ease-out transform-gpu hover:scale-[1.02] ${riskStyle.glow} ${riskStyle.hoverGlow}`}
                style={{
                    transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
            >
                {/* ── Risk accent bar ── */}
                <div
                    className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl ${riskStyle.bar}`}
                />

                {/* ── Hover shimmer overlay ── */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* ── Content ── */}
                <div className="p-5 pl-6">
                    {/* Top row: merchant + value */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-text-secondary text-sm font-medium flex-shrink-0">
                                {item.activity?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                    {item.activity ?? "—"}
                                </p>
                                {item.subtitle && (
                                    <p className="text-[10px] text-text-muted mt-0.5 truncate">
                                        {item.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Value */}
                        <p
                            className={`text-lg font-bold flex-shrink-0 ${item.value < 0 ? "text-red-400" : "text-emerald-400"
                                }`}
                        >
                            {item.value < 0 ? "-" : "+"}
                            {formatValue(item.value)}
                        </p>
                    </div>

                    {/* Bottom row: intent badge + impact */}
                    <div className="flex items-center justify-between gap-3">
                        <span
                            className={`inline-flex px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${intentStyle}`}
                        >
                            {item.psychologicalIntent ?? "—"}
                        </span>

                        <div className="flex items-center gap-2">
                            {riskLevel === "High" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            )}
                            <span className="text-[11px] text-text-muted">
                                {item.impact ?? "—"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
