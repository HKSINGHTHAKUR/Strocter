/* ── downloadHelper.js ──
   Shared utility for triggering browser "Save As" downloads from API responses.
   All export/download buttons across the app funnel through here.
*/

import api from "./api";

/**
 * Download a file from a backend endpoint.
 * The browser triggers a file save/download.
 *
 * @param {string} url - API endpoint path (relative to base)
 * @param {string} fallbackName - Fallback filename if server doesn't provide one
 */
export async function downloadFile(url, fallbackName = "strocter-export") {
    // Add cache-buster to prevent 304 Not Modified
    const separator = url.includes("?") ? "&" : "?";
    const cacheBustedUrl = `${url}${separator}_t=${Date.now()}`;

    const response = await api.get(cacheBustedUrl, {
        responseType: "blob",
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
        },
    });

    // Extract filename from Content-Disposition header if available
    const disposition = response.headers["content-disposition"];
    let fileName = fallbackName;
    if (disposition) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match?.[1]) fileName = match[1].replace(/['"]/g, "");
    }

    // Create blob URL and trigger download via invisible anchor
    const blob = new Blob([response.data]);
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
    }, 200);
}

/**
 * Export transactions as CSV and download
 */
export async function exportTransactionsCSV() {
    await downloadFile("/reports/export-csv?type=transactions", `strocter-transactions-${Date.now()}.csv`);
}

/**
 * Export analytics as CSV and download
 */
export async function exportAnalyticsCSV() {
    await downloadFile("/reports/export-csv?type=analytics", `strocter-analytics-${Date.now()}.csv`);
}

/**
 * Generate a report (POST) then immediately download it.
 * Falls back to CSV export if PDF download fails.
 */
export async function generateAndDownloadReport() {
    try {
        const { data } = await api.post("/reports/generate");
        const { reportId } = data;
        await downloadFile(`/reports/${reportId}/download`, `${reportId}.pdf`);
        return data;
    } catch {
        // Fallback to CSV if PDF fails
        await exportAnalyticsCSV();
    }
}
