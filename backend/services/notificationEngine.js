/* ── notificationEngine.js ──
   Determines which notifications to send based on user's SystemSettings.
   Called by transaction hooks and analysis engines.
*/

const SystemSettings = require("../models/SystemSettings");

/**
 * Check if a specific notification channel is enabled for a user.
 * @param {ObjectId} userId
 * @param {"impulseSpikes"|"riskEscalation"|"stabilityWarnings"|"goalTracking"|"weeklySummary"|"systemReports"} channel
 * @returns {Promise<boolean>}
 */
async function isChannelEnabled(userId, channel) {
    const settings = await SystemSettings.findOne({ userId });
    if (!settings) return true; // default: enabled
    return settings.notifications?.[channel] !== false;
}

/**
 * Determine which alerts should fire for a given event context.
 * @param {ObjectId} userId
 * @param {{ impulseSpike?: boolean, riskElevated?: boolean, stabilityDrop?: boolean, goalMissed?: boolean }} context
 * @returns {Promise<string[]>} list of alert types to send
 */
async function resolveAlerts(userId, context) {
    const settings = await SystemSettings.findOne({ userId });
    const notif = settings?.notifications || {};
    const alerts = [];

    if (context.impulseSpike && notif.impulseSpikes !== false) alerts.push("impulse_spike");
    if (context.riskElevated && notif.riskEscalation !== false) alerts.push("risk_escalation");
    if (context.stabilityDrop && notif.stabilityWarnings !== false) alerts.push("stability_warning");
    if (context.goalMissed && notif.goalTracking !== false) alerts.push("goal_tracking");

    return alerts;
}

/**
 * Check if a transaction should be flagged based on risk governance settings.
 * @param {ObjectId} userId
 * @param {{ amount: number, createdAt: Date }} transaction
 * @returns {Promise<{ flagged: boolean, reason?: string }>}
 */
async function evaluateTransactionRisk(userId, transaction) {
    const settings = await SystemSettings.findOne({ userId });
    if (!settings) return { flagged: false };

    const rg = settings.riskGovernance;
    const threshold = rg?.highRiskThreshold || 15;

    // Check high-risk amount threshold (as % of typical spend)
    // Simplified: flag if amount exceeds threshold * 1000
    if (transaction.amount > threshold * 1000) {
        return { flagged: true, reason: `Amount exceeds high-risk threshold (${threshold}%)` };
    }

    // Check late-night auto-control
    if (rg?.lateNightAutoControl) {
        const hours = new Date(transaction.createdAt).getHours();
        const lockStart = parseInt(rg.lockStartTime?.split(":")[0] || "23");
        const lockEnd = parseInt(rg.lockEndTime?.split(":")[0] || "6");

        const isLocked = lockStart > lockEnd
            ? hours >= lockStart || hours < lockEnd
            : hours >= lockStart && hours < lockEnd;

        if (isLocked) {
            return { flagged: true, reason: "Transaction during budget lock window" };
        }
    }

    return { flagged: false };
}

module.exports = { isChannelEnabled, resolveAlerts, evaluateTransactionRisk };
