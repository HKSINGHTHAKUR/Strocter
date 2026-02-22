const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { protect } = require("../middleware/authMiddleware");
const { premiumOnly } = require("../middleware/premiumOnly");
const { generatePDFReport, REPORTS_DIR } = require("../services/reportGenerator");
const { sendCSV } = require("../utils/exportCSV");
const Transaction = require("../models/Transaction");
const analyticsEngine = require("../services/analyticsEngine");

/* POST /api/reports/generate — Generate PDF report */
router.post("/generate", protect, premiumOnly, async (req, res) => {
    try {
        const { reportId, fileName } = await generatePDFReport(req.user._id);
        res.json({ reportId, fileName, message: "Report generated successfully" });
    } catch (err) {
        console.error("Report generation error:", err);
        res.status(500).json({ message: "Failed to generate report" });
    }
});

/* GET /api/reports/:id/download — Download a generated PDF */
router.get("/:id/download", protect, premiumOnly, async (req, res) => {
    try {
        const userDir = path.join(REPORTS_DIR, req.user._id.toString());
        const filePath = path.join(userDir, `${req.params.id}.pdf`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fileName = `${req.params.id}.pdf`;
        res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL || "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        fs.createReadStream(filePath).pipe(res);
    } catch (err) {
        console.error("Report download error:", err);
        res.status(500).json({ message: "Failed to download report" });
    }
});

/* GET /api/reports/export-csv?type=transactions|analytics — CSV export */
router.get("/export-csv", protect, premiumOnly, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const type = req.query.type || "transactions";

        if (type === "transactions") {
            const txns = await Transaction.find({ user: userId })
                .sort({ createdAt: -1 })
                .limit(1000)
                .lean();

            const data = txns.map((t) => ({
                Date: new Date(t.createdAt).toLocaleDateString(),
                Type: t.type,
                Category: t.category,
                Amount: t.amount,
                Emotion: t.emotion || "",
                Note: t.note || "",
                Tags: (t.tags || []).join(", "),
            }));

            return sendCSV(res, data, `strocter-transactions-${Date.now()}.csv`);
        }

        if (type === "analytics") {
            const metrics = await analyticsEngine.calculateBehavioralMetrics(userId);
            const categories = await analyticsEngine.calculateCategorySplit(userId);

            const data = [
                { Metric: "Emotional Spending", Value: metrics.emotionalSpending?.value },
                { Metric: "Logical Spending", Value: metrics.logicalSpending?.value },
                { Metric: "Dopamine Index", Value: `${metrics.dopamineIndex?.value}${metrics.dopamineIndex?.suffix || ""}` },
                { Metric: "Resilience Score", Value: metrics.resilienceScore?.value },
                { Metric: "Volatility Index", Value: metrics.volatilityIndex?.value },
                ...categories.map((c) => ({ Metric: `${c.category} (Emotional)`, Value: `${c.emotional}%` })),
            ];

            return sendCSV(res, data, `strocter-analytics-${Date.now()}.csv`);
        }

        res.status(400).json({ message: "Invalid export type" });
    } catch (err) {
        console.error("CSV export error:", err);
        res.status(500).json({ message: "Failed to export CSV" });
    }
});

module.exports = router;
