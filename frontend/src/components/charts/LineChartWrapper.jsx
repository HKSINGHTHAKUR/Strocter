import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const ChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-3 rounded-xl">
                <p className="text-xs text-text-secondary mb-1">{label}</p>
                {payload.map((entry) => (
                    <p key={entry.dataKey} className="text-sm font-semibold" style={{ color: entry.color }}>
                        {entry.name}: ₹{entry.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function LineChartWrapper({ data, lines, height = 280, animationDuration = 600 }) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid
                    stroke="rgba(255,255,255,0.04)"
                    strokeDasharray="3 3"
                    vertical={false}
                />
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
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)" }} />
                {lines.map((line) => (
                    <Line
                        key={line.dataKey}
                        type="monotone"
                        dataKey={line.dataKey}
                        name={line.name}
                        stroke={line.color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: line.color, stroke: "#0B0D10", strokeWidth: 2 }}
                        animationDuration={animationDuration}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}
