/* ── exportCSV.js ──
   Reusable CSV export utility for transactions, analytics, etc.
*/

const { Parser } = require("json2csv");

/**
 * Convert an array of objects to CSV string
 * @param {Object[]} data - Array of objects to export
 * @param {string[]} [fields] - Optional specific fields to include
 * @returns {string} CSV string
 */
function toCSV(data, fields) {
    if (!data || !data.length) return "";
    const opts = fields ? { fields } : {};
    const parser = new Parser(opts);
    return parser.parse(data);
}

/**
 * Send CSV as downloadable file
 * @param {Response} res - Express response
 * @param {Object[]} data - Data to export
 * @param {string} filename - Download filename
 * @param {string[]} [fields] - Fields to include
 */
function sendCSV(res, data, filename, fields) {
    const csv = toCSV(data, fields);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.send(csv);
}

module.exports = { toCSV, sendCSV };
