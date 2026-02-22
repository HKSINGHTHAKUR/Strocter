/* ── systemRecalculationService.js ──
   Called after transaction create/update/delete.
   Triggers recalculation of all dependent metrics.
*/

const { evaluateTransactionRisk, resolveAlerts } = require("./notificationEngine");

/**
 * Recalculate system metrics after a transaction change.
 * This is a fire-and-forget call — errors are logged but don't block the response.
 *
 * @param {ObjectId} userId
 * @param {{ amount: number, type: string, createdAt: Date, emotion?: string }} transaction
 * @param {"create"|"update"|"delete"} action
 */
async function recalculateAfterTransaction(userId, transaction, action) {
    try {
        // 1. Check risk governance rules
        if (action !== "delete" && transaction.type === "expense") {
            const riskResult = await evaluateTransactionRisk(userId, transaction);
            if (riskResult.flagged) {
                console.log(`[RECALC] Transaction flagged for user ${userId}: ${riskResult.reason}`);
            }
        }

        // 2. Check notification triggers
        if (action === "create" && transaction.type === "expense") {
            const context = {
                impulseSpike: transaction.amount > 5000,
                riskElevated: transaction.amount > 10000,
                stabilityDrop: false,
                goalMissed: false,
            };

            const alerts = await resolveAlerts(userId, context);
            if (alerts.length > 0) {
                console.log(`[RECALC] Alerts triggered for user ${userId}:`, alerts);
            }
        }

        console.log(`[RECALC] Completed for user ${userId} after ${action}`);
    } catch (err) {
        console.error(`[RECALC] Error for user ${userId}:`, err.message);
    }
}

module.exports = { recalculateAfterTransaction };
