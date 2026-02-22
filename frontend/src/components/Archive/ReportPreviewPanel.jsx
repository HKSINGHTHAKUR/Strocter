import { motion } from "framer-motion";
import ReportPreviewMetrics from "./ReportPreviewMetrics";

export default function ReportPreviewPanel({ preview }) {
    if (!preview) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-4">
                Formal Report Preview
            </p>

            {/* Document panel */}
            <div className="rounded-2xl bg-[#FAFAF8] text-[#0B0D10] shadow-2xl shadow-black/30 overflow-hidden relative">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                    <svg className="w-64 h-64" viewBox="0 0 100 100" fill="currentColor">
                        <circle cx="50" cy="50" r="45" />
                    </svg>
                </div>

                <div className="relative z-10 p-8 sm:p-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ec5b13] mb-2">
                                Confidential Behavioral Analysis
                            </p>
                            <p className="text-[11px] text-[#0B0D10]/50 font-mono">
                                Series: {preview.seriesId}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold">{preview.version}</p>
                            <p className="text-[10px] text-[#0B0D10]/50 mt-0.5">{preview.releaseDate}</p>
                            <p className="text-[10px] text-[#0B0D10]/40 font-mono mt-0.5">{preview.authCode}</p>
                        </div>
                    </div>

                    {/* Body: two-column */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Left (3/5) — Narrative */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Executive Summary */}
                            <div className="border-l-[3px] border-[#ec5b13] pl-4">
                                <p className="text-[11px] leading-relaxed text-[#0B0D10]/70 italic">
                                    {preview.executiveSummary}
                                </p>
                            </div>

                            {/* Narrative paragraphs */}
                            {preview.narrative.map((para, i) => (
                                <p key={i} className="text-[11px] leading-relaxed text-[#0B0D10]/60">
                                    {para}
                                </p>
                            ))}

                            {/* Mitigation Protocols */}
                            <div className="space-y-2 mt-4">
                                {preview.mitigationProtocols.map((item, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#ec5b13] mt-1.5 flex-shrink-0" />
                                        <p className="text-[10px] text-[#0B0D10]/60 leading-relaxed">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right (2/5) — Metrics */}
                        <div className="lg:col-span-2">
                            <ReportPreviewMetrics
                                metrics={preview.metrics}
                                projectionText={preview.projectionText}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-10 pt-4 border-t border-[#0B0D10]/[0.08]">
                        <p className="text-[8px] font-mono text-[#0B0D10]/30 uppercase tracking-wider">
                            {preview.documentId}
                        </p>
                        <p className="text-[8px] font-mono text-[#0B0D10]/30 uppercase tracking-wider">
                            {preview.pageInfo}
                        </p>
                        <p className="text-[8px] font-mono text-[#0B0D10]/30 uppercase tracking-wider">
                            {preview.copyright}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
