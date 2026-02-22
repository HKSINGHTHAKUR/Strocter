import MetricCard from "../../../components/MetricCard";

const METRIC_CONFIGS = [
    {
        key: "healthScore",
        label: "Financial Health Score",
        getValue: (m) => m?.stability?.financialHealthScore ?? "842",
        getSub: (m) => {
            const score = m?.stability?.financialHealthScore;
            return score ? `+${Math.round(score * 0.014)}%` : "+12%";
        },
        accent: "text-emerald-400",
        glowColor: "rgba(16,185,129,0.12)",
        delay: 1,
    },
    {
        key: "riskStatus",
        label: "Risk Status",
        getValue: (m) => m?.risk?.riskLevel ?? "MINIMAL",
        getSub: (m) =>
            m?.risk?.volatilityScore
                ? `Aggregated risk across ${m.risk.volatilityScore} vectors`
                : "Aggregated risk across 14 vectors",
        glowColor: "rgba(249,115,22,0.10)",
        delay: 2,
    },
    {
        key: "weeklyTrend",
        label: "Weekly Trend",
        getValue: (m) =>
            m?.weeklySummary?.changePercentage != null
                ? `${m.weeklySummary.changePercentage}%`
                : "2.4%",
        getSub: (m) => m?.weeklySummary?.trend ?? "Reduction in impulse",
        glowColor: "rgba(99,102,241,0.12)",
        delay: 3,
    },
    {
        key: "stability",
        label: "Stability Index",
        getValue: (m) => {
            const score = m?.stability?.financialHealthScore;
            return score ? `${Math.min(score, 100)}/100` : "94/100";
        },
        getSub: () => "Optimal fiscal composure",
        glowColor: "rgba(110,51,177,0.12)",
        delay: 4,
    },
];

export default function MetricsGrid({ metrics }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {METRIC_CONFIGS.map((config) => (
                <MetricCard
                    key={config.key}
                    label={config.label}
                    value={config.getValue(metrics)}
                    sub={config.getSub(metrics)}
                    accent={config.accent}
                    glowColor={config.glowColor}
                    delay={config.delay}
                />
            ))}
        </div>
    );
}
