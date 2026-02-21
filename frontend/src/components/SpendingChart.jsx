import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-3" style={{ borderRadius: 12 }}>
                <p className="text-xs text-text-secondary">{label}</p>
                <p className="text-sm font-semibold">₹{payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

export default function SpendingChart({ weeklyData }) {
    // Fallback data if API doesn't provide chart points
    const data = weeklyData ?? [
        { name: "Mon", amount: 800 },
        { name: "Tue", amount: 1200 },
        { name: "Wed", amount: 600 },
        { name: "Thu", amount: 2200 },
        { name: "Fri", amount: 1800 },
        { name: "Sat", amount: 3000 },
        { name: "Sun", amount: 1500 },
    ];

    return (
        <div className="chart-glass p-6 fade-in fade-in-delay-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-6">Spending Trend</p>
            <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#5A5D6B", fontSize: 11 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#5A5D6B", fontSize: 11 }}
                        tickFormatter={(v) => `₹${v}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)" }} />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#6366F1"
                        strokeWidth={2}
                        fill="url(#colorSpend)"
                        dot={false}
                        activeDot={{ r: 4, fill: "#6366F1", stroke: "#0B0D10", strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
