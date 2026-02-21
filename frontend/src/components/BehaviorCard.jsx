export default function BehaviorCard({ icon, label, value, sub, delay = 0 }) {
    return (
        <div className={`glass-card p-5 fade-in fade-in-delay-${delay}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-text-secondary">
                    {icon}
                </div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">{label}</p>
            </div>
            <p className="text-2xl font-bold">{value}</p>
            {sub && <p className="text-text-muted text-xs mt-1.5">{sub}</p>}
        </div>
    );
}
