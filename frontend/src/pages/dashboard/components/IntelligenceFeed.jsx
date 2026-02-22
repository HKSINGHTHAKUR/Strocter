import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { getIntelligenceFeed } from "../../../services/dashboardService";
import IntelligenceCard from "../../../components/intelligence/IntelligenceCard";

export default function IntelligenceFeed() {
    const [feedData, setFeedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const data = await getIntelligenceFeed();
                setFeedData(data?.feed ?? data ?? []);
            } catch {
                setError("Unable to load intelligence feed");
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    return (
        <div className="fade-in fade-in-delay-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm font-semibold">Intelligence Feed</p>
                    <p className="text-[10px] text-text-muted mt-0.5">
                        AI-analyzed transaction insights
                    </p>
                </div>
                <button className="text-xs text-accent-orange font-medium hover:underline cursor-pointer">
                    Export Ledger
                </button>
            </div>

            {/* States */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                </div>
            ) : error && feedData.length === 0 ? (
                <p className="text-text-muted text-sm py-12 text-center">{error}</p>
            ) : feedData.length === 0 ? (
                <p className="text-text-muted text-sm py-12 text-center">
                    No intelligence data available yet.
                </p>
            ) : (
                /* ── 3D Card Grid ── */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    <AnimatePresence mode="popLayout">
                        {feedData.map((item, index) => (
                            <IntelligenceCard
                                key={item.id ?? index}
                                item={item}
                                index={index}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
