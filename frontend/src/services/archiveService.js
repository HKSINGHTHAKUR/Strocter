/* ── archiveService.js ──
   Structured mock data that mirrors the future backend API shape.
   Replace mock returns with real api.get() calls when backend is ready.
*/

const MOCK_OVERVIEW = [
    {
        id: "monthly-behavioral",
        icon: "📊",
        badge: "Monthly",
        badgeColor: "bg-[#ec5b13]/15 text-[#ec5b13]",
        title: "Monthly Behavioral Summary",
        description: "Individual behavioral patterns for the current month tracking volatility.",
        metricLabel: "Stability Score",
        metricValue: "94.2",
        actionText: "View Data",
    },
    {
        id: "impulse-risk",
        icon: "⚠️",
        badge: "Weekly",
        badgeColor: "bg-yellow-500/15 text-yellow-400",
        title: "Impulse Risk Report",
        description: "Risk assessment of impulsive financial decisions and rapid outflows.",
        metricLabel: "Risk Level",
        metricValue: "Critical",
        metricColor: "text-[#ec5b13]",
        actionText: "Review",
    },
    {
        id: "stability-evolution",
        icon: "📈",
        badge: "Quarterly",
        badgeColor: "bg-[#6E33B1]/15 text-[#6E33B1]",
        title: "Stability Evolution",
        description: "Long-term stability tracking and behavioral growth trajectory modeling.",
        metricLabel: "Net Change",
        metricValue: "+12.4%",
        metricColor: "text-emerald-400",
        actionText: "Download",
    },
    {
        id: "financial-health",
        icon: "💚",
        badge: "Real-time",
        badgeColor: "bg-emerald-500/15 text-emerald-400",
        title: "Financial Health Snapshot",
        description: "Comprehensive, live overview of organizational financial wellness.",
        metricLabel: "AI Confidence",
        metricValue: "99.1%",
        actionText: "Expand",
    },
];

const MOCK_REPORTS = [
    {
        id: "rpt-001",
        type: "Monthly Behavioral Summary",
        dateGenerated: "Oct 24, 2023",
        period: "Oct 01–Oct 31",
        stability: 88.5,
        risk: "LOW",
        confidence: 97.4,
    },
    {
        id: "rpt-002",
        type: "Impulse Risk Analysis",
        dateGenerated: "Oct 22, 2023",
        period: "Oct 14–Oct 21",
        stability: 42.1,
        risk: "HIGH",
        confidence: 94.1,
    },
    {
        id: "rpt-003",
        type: "Wealth Retention Audit",
        dateGenerated: "Oct 18, 2023",
        period: "Sep 01–Oct 15",
        stability: 76.9,
        risk: "MEDIUM",
        confidence: 95.2,
    },
];

const MOCK_PREVIEW = {
    seriesId: "STROCT-2023-BX-42",
    version: "Strocter Intelligence v4.2",
    releaseDate: "Released: Oct 25, 2023",
    authCode: "AUTH: 0082 . . . F809",
    executiveSummary:
        '"The behavioral profile for the current fiscal period indicates high-stability engagement with a subtle uptick in emotional spend during market volatility events. Overall health remains within the top 5th percentile of institutional benchmarks."',
    narrative: [
        "Our engine has detected a consistent pattern of capital preservation strategies being executed during mid-week liquidity shifts. However, the AI notes a 12% increase in 'micro-impulse' transactions — small, repeated outlays that bypass standard risk thresholds.",
        "This behavior typically precedes a psychological shift toward aggressive acquisition. Monitoring of the sentiment-to-spend ratio is recommended for the next 14 business days to prevent portfolio degradation.",
    ],
    mitigationProtocols: [
        "Initiate 24-hour delay on transactions exceeding $15k USD.",
        "Automate wealth retention sweep for excess liquidity above baseline.",
        "Activate emotional spend alerts for weekend high-velocity spending.",
    ],
    metrics: {
        stability: 87,
        riskVariance: 42,
        emotionalSpend: 23,
    },
    projectionText:
        '"Forecasted growth remains linear with a predicted 14.2% increase in net asset value assuming behavioral stability sustains current trajectory."',
    documentId: "SYS/CM GEN 18 STR-INT-00123",
    pageInfo: "PAGE 01 OF 01",
    copyright: "© 2024 STROCTER INSTITUTIONAL.",
};

/* ── Service Functions (swap with real API later) ── */

export const getArchiveOverview = async () => {
    // Future: const { data } = await api.get("/archive/overview");
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_OVERVIEW), 400));
};

export const getArchiveReports = async () => {
    // Future: const { data } = await api.get("/archive/reports");
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_REPORTS), 500));
};

export const getReportPreview = async (reportId) => {
    // Future: const { data } = await api.get(`/archive/${reportId}`);
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PREVIEW), 600));
};
