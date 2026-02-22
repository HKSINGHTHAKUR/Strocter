/* ── reportGenerator.js ──
   Generates PDF reports from real analytics data using pdfkit.
*/

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const analyticsEngine = require("./analyticsEngine");

const REPORTS_DIR = path.join(__dirname, "..", "generated-reports");

/* Ensure the reports directory exists */
function ensureDir(userId) {
    const userDir = path.join(REPORTS_DIR, userId.toString());
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }
    return userDir;
}

/**
 * Generate a full behavioral PDF report
 * @param {ObjectId} userId
 * @returns {{ reportId: string, filePath: string, fileName: string }}
 */
async function generatePDFReport(userId) {
    const uid = new mongoose.Types.ObjectId(userId);
    const [metrics, cognitive, categories] = await Promise.all([
        analyticsEngine.calculateBehavioralMetrics(uid),
        analyticsEngine.generateCognitiveAnalysis(uid),
        analyticsEngine.calculateCategorySplit(uid),
    ]);

    const reportId = `RPT-${Date.now()}`;
    const fileName = `${reportId}.pdf`;
    const userDir = ensureDir(userId);
    const filePath = path.join(userDir, fileName);

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: "A4", margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        doc.fontSize(22).font("Helvetica-Bold").text("STROCTER", { align: "center" });
        doc.fontSize(10).font("Helvetica").fillColor("#888888").text("Institutional Behavioral Intelligence Report", { align: "center" });
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#333333").stroke();
        doc.moveDown(1);

        // Report Meta
        doc.fillColor("#000000").fontSize(9).font("Helvetica");
        doc.text(`Report ID: ${reportId}`, { align: "left" });
        doc.text(`Generated: ${new Date().toLocaleString()}`, { align: "left" });
        doc.text(`User: ${userId}`, { align: "left" });
        doc.moveDown(1);

        // Executive Summary
        doc.fontSize(14).font("Helvetica-Bold").text("Executive Summary");
        doc.moveDown(0.3);
        doc.fontSize(10).font("Helvetica").text(cognitive.narrative || "No cognitive data available.");
        doc.moveDown(1);

        // Key Metrics
        doc.fontSize(14).font("Helvetica-Bold").text("Key Behavioral Metrics");
        doc.moveDown(0.3);

        const metricsList = [
            ["Emotional Spending", metrics.emotionalSpending?.value || "N/A"],
            ["Logical Spending", metrics.logicalSpending?.value || "N/A"],
            ["Dopamine Index", `${metrics.dopamineIndex?.value || "N/A"}${metrics.dopamineIndex?.suffix || ""}`],
            ["Resilience Score", metrics.resilienceScore?.value || "N/A"],
            ["Volatility Index", metrics.volatilityIndex?.value || "N/A"],
        ];

        metricsList.forEach(([label, value]) => {
            doc.fontSize(10).font("Helvetica-Bold").text(`${label}: `, { continued: true });
            doc.font("Helvetica").text(value);
        });
        doc.moveDown(1);

        // Cognitive Analysis
        doc.fontSize(14).font("Helvetica-Bold").text("Cognitive Analysis");
        doc.moveDown(0.3);
        doc.fontSize(10).font("Helvetica");
        doc.text(`Primary Trigger: ${cognitive.trigger || "N/A"}`);
        doc.text(`Recommended Action: ${cognitive.action || "N/A"}`);
        doc.moveDown(0.5);
        doc.font("Helvetica-Oblique").text(cognitive.quote || "");
        doc.moveDown(1);

        // Category Breakdown
        if (categories?.length) {
            doc.fontSize(14).font("Helvetica-Bold").text("Category Breakdown");
            doc.moveDown(0.3);
            categories.forEach((cat) => {
                doc.fontSize(10).font("Helvetica").text(`${cat.category}: Emotional ${cat.emotional}% | Logical ${cat.logical}%`);
            });
        }

        doc.moveDown(2);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#cccccc").stroke();
        doc.moveDown(0.5);
        doc.fontSize(8).fillColor("#999999").text(`© ${new Date().getFullYear()} Strocter Institutional. Confidential.`, { align: "center" });

        doc.end();
        stream.on("finish", () => resolve({ reportId, filePath, fileName }));
        stream.on("error", reject);
    });
}

module.exports = { generatePDFReport, REPORTS_DIR };
