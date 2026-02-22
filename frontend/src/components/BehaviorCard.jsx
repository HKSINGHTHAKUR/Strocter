export default function BehaviorCard({ label, value, sub, subColor, delay = 0 }) {
    return (
        <div className={`glass-card p-5 fade-in fade-in-delay-${delay}`}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-3">
                {label}
            </p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {sub && (
                <p className={`text-xs mt-1.5 ${subColor || "text-text-muted"}`}>
                    {sub}
                </p>
            )}
        </div>
    );
}
