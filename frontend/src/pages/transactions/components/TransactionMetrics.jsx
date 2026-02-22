import MetricCard from "../../../components/MetricCard";

export default function TransactionMetrics({ metrics }) {
    const total = metrics?.totalTransactions ?? 0;
    const change = metrics?.changePercent ?? 0;
    const logical = metrics?.logicalPercent ?? 0;
    const emotional = metrics?.emotionalPercent ?? 0;
    const highRisk = metrics?.highRiskSpending ?? 0;
    const volatility = metrics?.volatility ?? "Low";
    const volLabel = metrics?.volatilityLabel ?? "STABLE";

    const volBadgeColor =
        volLabel === "STABLE"
            ? "bg-emerald-500/15 text-emerald-400"
            : volLabel === "CAUTION"
                ? "bg-amber-500/15 text-amber-400"
                : "bg-red-500/15 text-red-400";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
                label="Total Transactions"
                value={total.toLocaleString()}
                sub={`${change >= 0 ? "+" : ""}${change}%`}
                accent="text-emerald-400"
                delay={1}
            />
            <MetricCard
                label="Logical vs Emotional"
                value={logical}
                sub={`/${emotional}%`}
                subColor="text-text-muted"
                delay={2}
            />
            <MetricCard
                label="High Risk Spending"
                value={`$${highRisk.toLocaleString()}`}
                delay={3}
            />

            {/* Volatility card with inline badge */}
            <div className="glass-card p-6 fade-in fade-in-delay-4">
                <p className="text-text-muted text-[10px] font-semibold uppercase tracking-widest mb-3">
                    Behavioral Volatility
                </p>
                <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold tracking-tight">{volatility}</p>
                    <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${volBadgeColor}`}
                    >
                        {volLabel}
                    </span>
                </div>
            </div>
        </div>
    );
}
