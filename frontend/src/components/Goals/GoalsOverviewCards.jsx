import GoalCard from "./GoalCard";

export default function GoalsOverviewCards({ overview }) {
    if (!overview) return null;
    const { stability, impulse, savings, risk } = overview;

    const cards = [
        {
            icon: "📈",
            badge: "Stability",
            badgeColor: "bg-[#6E33B1]/15 text-[#6E33B1]",
            label: "Stability Target Index",
            current: stability?.current ?? 0,
            suffix: `/ ${stability?.target ?? 95} Target`,
            progress: stability?.progress ?? 0,
            progressColor: "bg-[#38E6A2]",
            subLeft: `${stability?.progress ?? 0}% Progress`,
            subRight: `+${Math.abs(stability?.mom ?? 0)}% Δ`,
            subRightColor: "text-emerald-400",
        },
        {
            icon: "🛡",
            badge: "Impulse",
            badgeColor: "bg-[#6E33B1]/15 text-[#6E33B1]",
            label: "Impulse Reduction",
            current: impulse?.current ?? 0,
            suffix: `/ ${impulse?.target ?? 60} Target`,
            progress: impulse?.target > 0 ? Math.round((impulse?.current / impulse?.target) * 100) : 0,
            progressColor: "bg-[#6E33B1]",
            subLeft: `${impulse?.improvement > 0 ? "-" : "+"}${Math.abs(impulse?.improvement ?? 0)}% Improvement`,
            subRight: impulse?.status ?? "Stable",
            subRightColor: impulse?.status === "Stable" ? "text-text-muted" : "text-[#ec5b13]",
        },
        {
            icon: "💰",
            badge: "Savings",
            badgeColor: "bg-emerald-500/15 text-emerald-400",
            label: "Savings Milestone",
            current: savings?.current ?? "₹0k",
            suffix: `/ ${savings?.target ?? "₹250k"} Target`,
            progress: savings?.progress ?? 0,
            progressColor: "bg-[#ec5b13]",
            subLeft: `${savings?.progress ?? 0}% Completion`,
            subRight: `${savings?.mom ?? "+₹0k"} MoM`,
            subRightColor: "text-emerald-400",
        },
        {
            icon: "⚡",
            badge: "Risk",
            badgeColor: "bg-[#ec5b13]/15 text-[#ec5b13]",
            label: "Risk Exposure",
            current: risk?.current ?? "0%",
            suffix: `/ ${risk?.target ?? "-30% Target"}`,
            progress: risk?.progress ?? 0,
            progressColor: "bg-[#6E33B1]",
            subLeft: `${risk?.progress ?? 0}% to Target`,
            subRight: risk?.status ?? "Optimizing",
            subRightColor: "text-text-muted",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((card, i) => (
                <GoalCard key={card.label} {...card} index={i} />
            ))}
        </div>
    );
}
