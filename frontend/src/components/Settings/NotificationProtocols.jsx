const NOTIFICATION_ITEMS = [
    { key: "impulseSpikes", label: "Impulse Spike Alerts", desc: "Notify when impulsive spending exceeds threshold." },
    { key: "riskEscalation", label: "Risk Escalation Warnings", desc: "Alert on high-risk transaction patterns." },
    { key: "stabilityWarnings", label: "Stability Drop Notifications", desc: "Warn when financial stability index declines." },
    { key: "goalTracking", label: "Goal Progress Updates", desc: "Track milestone achievements and missed targets." },
    { key: "weeklySummary", label: "Weekly Behavioral Summary", desc: "Receive a digest every Monday morning." },
    { key: "systemReports", label: "System Intelligence Reports", desc: "Automated analytical reports from the engine." },
];

export default function NotificationProtocols({ notifications, onChange }) {
    if (!notifications) return null;

    const toggle = (key) => onChange({ ...notifications, [key]: !notifications[key] });

    return (
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#a855f7]">🔔</span>
                    <h2 className="text-base font-bold">Notification Protocols</h2>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                    Control which intelligence alerts and system notifications are active for your account.
                </p>
            </div>

            <div className="lg:col-span-3 rounded-2xl border border-[#2D3139] bg-[#12141A] p-6">
                <div className="space-y-1">
                    {NOTIFICATION_ITEMS.map((item) => (
                        <div
                            key={item.key}
                            className="flex items-center justify-between py-3 border-b border-white/[0.03] last:border-0"
                        >
                            <div>
                                <p className="text-xs font-semibold">{item.label}</p>
                                <p className="text-[10px] text-text-muted mt-0.5">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => toggle(item.key)}
                                className={`w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer flex items-center ${notifications[item.key] ? "bg-[#10b981]" : "bg-[#2D3139]"
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 mx-0.5 ${notifications[item.key] ? "translate-x-5" : ""
                                    }`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
