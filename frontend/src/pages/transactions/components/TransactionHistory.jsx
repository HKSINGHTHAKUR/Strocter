const INTENT_STYLES = {
    "STRESS IMPULSE": "bg-red-500/15 text-red-400 border border-red-500/20",
    "LOGICAL/ROUTINE": "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    "EMOTIONAL/SOCIAL": "bg-accent-purple/15 text-accent-purple border border-accent-purple/20",
    "INVESTMENT": "bg-blue-500/15 text-blue-400 border border-blue-500/20",
};

const IMPACT_BAR_COLORS = {
    "High Risk": "bg-accent-orange",
    "Moderate": "bg-amber-500",
    "Neutral": "bg-emerald-500",
    "Optimal": "bg-emerald-400",
};

const COLUMN_HEADERS = ["Date & Time", "Merchant", "Psychological Intent", "Impact Score", "Value"];

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const opts = { year: "numeric", month: "short", day: "numeric" };
    const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return { date: date.toLocaleDateString("en-US", opts), time };
}

function getMerchantIcon(category) {
    const cat = (category || "").toLowerCase();
    if (["groceries", "food"].includes(cat)) return "🛒";
    if (["entertainment", "shopping"].includes(cat)) return "🛍️";
    if (["utilities", "rent"].includes(cat)) return "🏠";
    if (["investment", "savings"].includes(cat)) return "📈";
    if (["education"].includes(cat)) return "📚";
    if (["health"].includes(cat)) return "🏥";
    return "💳";
}

export default function TransactionHistory({
    history,
    pagination,
    loading,
    error,
    onPageChange,
}) {
    const getIntentStyle = (intent) =>
        INTENT_STYLES[intent] ?? "bg-white/[0.06] text-text-secondary";

    const getBarColor = (label) =>
        IMPACT_BAR_COLORS[label] ?? "bg-text-muted";

    return (
        <div className="glass-card p-6 fade-in fade-in-delay-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <p className="text-lg font-semibold">Transaction History</p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[10px] text-text-muted">Logical</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-accent-orange" />
                        <span className="text-[10px] text-text-muted">Impulse</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-[10px] text-text-muted">Stress</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                </div>
            ) : error && history.length === 0 ? (
                <p className="text-text-muted text-sm py-12 text-center">{error}</p>
            ) : history.length === 0 ? (
                <p className="text-text-muted text-sm py-12 text-center">
                    No transactions found.
                </p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    {COLUMN_HEADERS.map((header) => (
                                        <th
                                            key={header}
                                            className="text-left text-[10px] font-medium uppercase tracking-widest text-text-muted pb-3 pr-4"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((txn, idx) => {
                                    const { date, time } = formatDate(txn.date);
                                    return (
                                        <tr
                                            key={txn.id ?? idx}
                                            className="txn-row border-b border-white/[0.03] last:border-0"
                                        >
                                            {/* Date & Time */}
                                            <td className="py-4 pr-4">
                                                <p className="text-sm font-medium">{date}</p>
                                                <p className="text-[10px] text-text-muted">{time}</p>
                                            </td>

                                            {/* Merchant */}
                                            <td className="py-4 pr-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-sm flex-shrink-0">
                                                        {getMerchantIcon(txn.category)}
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        {txn.merchant}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Psychological Intent */}
                                            <td className="py-4 pr-4">
                                                <span
                                                    className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getIntentStyle(txn.psychologicalIntent)}`}
                                                >
                                                    {txn.psychologicalIntent}
                                                </span>
                                            </td>

                                            {/* Impact Score */}
                                            <td className="py-4 pr-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${getBarColor(txn.impactLabel)} transition-all duration-500`}
                                                            style={{ width: `${txn.impactScore}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-xs font-medium ${txn.impactLabel === "High Risk"
                                                            ? "text-accent-orange"
                                                            : txn.impactLabel === "Moderate"
                                                                ? "text-amber-500"
                                                                : "text-emerald-400"
                                                        }`}>
                                                        {txn.impactLabel}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Value */}
                                            <td className="py-4 text-sm font-semibold text-right">
                                                ${txn.value?.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination && (
                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.06]">
                            <p className="text-xs text-text-muted">
                                Showing {(pagination.page - 1) * pagination.limit + 1}-
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                                {pagination.total.toLocaleString()} transactions
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onPageChange(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => onPageChange(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
