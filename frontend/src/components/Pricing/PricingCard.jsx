import { motion } from "framer-motion";

export default function PricingCard({ plan, price, period, features, badge, isPopular, ctaText, onCta, disabled, isCurrentPlan }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative rounded-2xl border p-8 flex flex-col ${isPopular
                    ? "border-[#ec5b13]/40 bg-gradient-to-b from-[#ec5b13]/[0.06] to-transparent shadow-lg shadow-[#ec5b13]/5"
                    : "border-white/[0.06] bg-[#12141A]"
                }`}
        >
            {/* Badge */}
            {badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-[#ec5b13] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#ec5b13]/30">
                        {badge}
                    </span>
                </div>
            )}

            {/* Plan Name */}
            <h3 className="text-lg font-bold mb-1">{plan}</h3>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">{price}</span>
                {period && <span className="text-text-muted text-sm">{period}</span>}
            </div>

            <div className="h-px bg-white/[0.06] my-6" />

            {/* Features */}
            <ul className="space-y-3 flex-1 mb-8">
                {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                        {f.included ? (
                            <svg className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 mt-0.5 text-white/20 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <span className={f.included ? "text-text-secondary" : "text-white/25"}>
                            {f.label}
                        </span>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <button
                onClick={onCta}
                disabled={disabled || isCurrentPlan}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer disabled:cursor-default ${isCurrentPlan
                        ? "bg-white/[0.06] border border-white/[0.08] text-text-muted"
                        : isPopular
                            ? "bg-[#ec5b13] text-white hover:bg-[#ec5b13]/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ec5b13]/25"
                            : "bg-white/[0.06] border border-white/[0.08] text-white hover:bg-white/[0.1]"
                    }`}
            >
                {isCurrentPlan ? "Current Plan" : ctaText}
            </button>
        </motion.div>
    );
}
