const fallbackTxns = [
    { id: 1, category: "Food", amount: 450, date: "Today", type: "expense" },
    { id: 2, category: "Transport", amount: 120, date: "Today", type: "expense" },
    { id: 3, category: "Shopping", amount: 2800, date: "Yesterday", type: "expense" },
    { id: 4, category: "Bills", amount: 1500, date: "Yesterday", type: "expense" },
    { id: 5, category: "Entertainment", amount: 350, date: "2 days ago", type: "expense" },
];

export default function RecentTransactions({ transactions }) {
    const txns = transactions ?? fallbackTxns;

    return (
        <div className="glass-card p-6 fade-in fade-in-delay-6" style={{ borderRadius: 24 }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-5">Recent Transactions</p>

            <div className="flex flex-col gap-1">
                {txns.map((txn, i) => (
                    <div key={txn.id ?? i} className="txn-row flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-text-secondary text-xs font-medium">
                                {txn.category?.[0] ?? "?"}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{txn.category}</p>
                                <p className="text-xs text-text-muted">{txn.date ?? "—"}</p>
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-text-secondary">
                            {txn.type === "income" ? "+" : "−"}₹{Math.abs(txn.amount).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
