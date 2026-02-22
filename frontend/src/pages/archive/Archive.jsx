import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import ArchiveHeader from "../../components/Archive/ArchiveHeader";
import IntelligenceOverviewGrid from "../../components/Archive/IntelligenceOverviewGrid";
import ReportsTable from "../../components/Archive/ReportsTable";
import ReportPreviewPanel from "../../components/Archive/ReportPreviewPanel";
import ArchiveFooter from "../../components/Archive/ArchiveFooter";
import {
    getArchiveOverview,
    getArchiveReports,
    getReportPreview,
} from "../../services/archiveService";

export default function Archive() {
    const [overview, setOverview] = useState([]);
    const [reports, setReports] = useState([]);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    /* ── Parallax ── */
    const handleMouseMove = useCallback((e) => {
        setMouse({
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2,
        });
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    /* ── Fetch all data ── */
    useEffect(() => {
        const init = async () => {
            try {
                const [ov, rpts, prev] = await Promise.all([
                    getArchiveOverview(),
                    getArchiveReports(),
                    getReportPreview("rpt-001"),
                ]);
                setOverview(ov);
                setReports(rpts);
                setPreview(prev);
            } catch (err) {
                console.error("Archive init error:", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    return (
        <div className="min-h-screen">
            {/* ── Atmospheric Background ── */}
            <div className="atmo-bg">
                <div className="atmo-glow-purple" style={{ transform: `translate(${mouse.x * 30}px, ${mouse.y * 20}px)` }} />
                <div className="atmo-glow-orange" style={{ transform: `translate(${mouse.x * -20}px, ${mouse.y * -15}px)` }} />
                <div className="atmo-beam" />
            </div>
            <div className="noise-overlay" />

            <Sidebar />
            <TopNav />

            <main className="ml-[72px] pt-[64px] relative z-10">
                <div className="max-w-[1400px] mx-auto px-10 py-8 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <div className="w-8 h-8 rounded-full border-2 border-[#ec5b13] border-t-transparent animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* ── Header ── */}
                            <ArchiveHeader />

                            {/* ── Intelligence Overview Grid ── */}
                            <IntelligenceOverviewGrid overview={overview} />

                            {/* ── Historical Documentation Table ── */}
                            <ReportsTable reports={reports} />

                            {/* ── Formal Report Preview ── */}
                            <ReportPreviewPanel preview={preview} />

                            {/* ── Footer ── */}
                            <ArchiveFooter />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
