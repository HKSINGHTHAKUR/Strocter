import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import TransactionMetrics from "./components/TransactionMetrics";
import BehavioralAlert from "./components/BehavioralAlert";
import TransactionHistory from "./components/TransactionHistory";
import {
    getTransactionMetrics,
    getTransactionHistory,
} from "../../services/transactionsService";

export default function Transactions() {
    const [metrics, setMetrics] = useState(null);
    const [history, setHistory] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [error, setError] = useState("");
    const [historyError, setHistoryError] = useState("");
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    /* ── Fetch metrics on mount ── */
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getTransactionMetrics();
                setMetrics(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load metrics");
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    /* ── Fetch history on page change ── */
    useEffect(() => {
        const fetchHistory = async () => {
            setHistoryLoading(true);
            try {
                const data = await getTransactionHistory(page, 10);
                setHistory(data.history ?? []);
                setPagination(data.pagination ?? null);
            } catch (err) {
                setHistoryError(
                    err.response?.data?.message || "Failed to load transactions"
                );
            } finally {
                setHistoryLoading(false);
            }
        };
        fetchHistory();
    }, [page]);

    /* ── Parallax mouse tracking ── */
    const handleMouseMove = useCallback((e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMouse({ x, y });
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && (!pagination || newPage <= pagination.totalPages)) {
            setPage(newPage);
        }
    };

    /* ── Loading State ── */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    <p className="text-text-muted text-sm">Loading transactions...</p>
                </div>
            </div>
        );
    }

    /* ── Error State ── */
    if (error && !metrics) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-8 text-center max-w-sm">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* ── Atmospheric Background ── */}
            <div className="atmo-bg">
                <div
                    className="atmo-glow-purple"
                    style={{
                        transform: `translate(${mouse.x * 30}px, ${mouse.y * 20}px)`,
                    }}
                />
                <div
                    className="atmo-glow-orange"
                    style={{
                        transform: `translate(${mouse.x * -20}px, ${mouse.y * -15}px)`,
                    }}
                />
                <div className="atmo-beam" />
            </div>

            {/* ── Noise Grain ── */}
            <div className="noise-overlay" />

            {/* ── Sidebar ── */}
            <Sidebar />

            {/* ── Top Nav ── */}
            <TopNav />

            {/* ── Main Content ── */}
            <main className="ml-[72px] pt-[64px] relative z-10">
                <div className="max-w-[1200px] mx-auto px-8 py-10 overflow-y-auto">
                    <div className="space-y-8">
                        {/* ── Page Header ── */}
                        <div className="fade-in">
                            <div className="flex items-start justify-between gap-6">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Transactions Intelligence
                                    </h1>
                                    <p className="text-text-secondary text-sm mt-1">
                                        AI-powered behavioral classification and intent analysis
                                    </p>
                                </div>

                                {/* Action bar */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {/* Search */}
                                    <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2">
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#5A5D6B"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        >
                                            <circle cx="11" cy="11" r="8" />
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Search merchants..."
                                            className="bg-transparent outline-none text-sm text-text-secondary placeholder-text-muted w-36"
                                        />
                                    </div>

                                    {/* Filter */}
                                    <button className="p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] transition-colors cursor-pointer">
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#5A5D6B"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        >
                                            <line x1="4" y1="6" x2="20" y2="6" />
                                            <line x1="8" y1="12" x2="16" y2="12" />
                                            <line x1="11" y1="18" x2="13" y2="18" />
                                        </svg>
                                    </button>

                                    {/* Date range */}
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-text-secondary">
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#5A5D6B"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        >
                                            <rect x="3" y="4" width="18" height="18" rx="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        <span className="text-xs whitespace-nowrap">
                                            Oct 1 - Oct 31
                                        </span>
                                    </div>

                                    {/* Report */}
                                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-orange text-white text-sm font-medium hover:bg-accent-orange/90 transition-colors cursor-pointer">
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        >
                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        Report
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ── Metrics Row ── */}
                        <TransactionMetrics metrics={metrics} />

                        {/* ── Behavioral Alert ── */}
                        <BehavioralAlert />

                        {/* ── Transaction History Table ── */}
                        <TransactionHistory
                            history={history}
                            pagination={pagination}
                            loading={historyLoading}
                            error={historyError}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
