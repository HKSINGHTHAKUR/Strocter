export default function MetricCard({ label, value, sub, delay = 0 }) {
    return (
        <div className={`glass-card p-6 fade-in fade-in-delay-${delay}`}>
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-3">{label}</p>
            <p className="text-4xl font-bold tracking-tight">{value}</p>
            {sub && <p className="text-text-muted text-sm mt-2">{sub}</p>}
        </div>
    );
}
