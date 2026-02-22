import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

/* ── Clamp utility ── */
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

export default function MetricCard({
    label,
    value,
    sub,
    subColor,
    accent,
    delay = 0,
    glowColor = "rgba(99,102,241,0.12)",
}) {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const rafRef = useRef(null);

    /* ── Mouse tilt handler ── */
    const handleMouseMove = useCallback((e) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            if (!cardRef.current) return;
            const rect = cardRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const pctX = (e.clientX - centerX) / (rect.width / 2);
            const pctY = (e.clientY - centerY) / (rect.height / 2);
            setTilt({
                x: clamp(-pctY * 8, -8, 8),
                y: clamp(pctX * 8, -8, 8),
            });
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setTilt({ x: 0, y: 0 });
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: delay * 0.08,
            }}
            className="perspective-[1200px] h-full"
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-all duration-300 ease-out transform-gpu hover:scale-[1.03] p-6 h-full"
                style={{
                    transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 40px ${glowColor}`,
                }}
            >
                {/* ── Top highlight edge ── */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

                {/* ── Hover shimmer ── */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* ── Radial glow on hover ── */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{
                        background: `radial-gradient(ellipse at 50% 0%, ${glowColor}, transparent 70%)`,
                    }}
                />

                {/* ── Content ── */}
                <div className="relative z-10">
                    <p className="text-text-muted text-[10px] font-semibold uppercase tracking-widest mb-3">
                        {label}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold tracking-tight">{value}</p>
                        {accent && (
                            <span className={`text-sm font-semibold ${accent}`}>
                                {sub}
                            </span>
                        )}
                    </div>
                    {!accent && sub && (
                        <p
                            className={`text-xs mt-2 ${subColor || "text-text-muted"}`}
                        >
                            {sub}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
