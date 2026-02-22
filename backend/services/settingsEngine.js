/* ── settingsEngine.js ──
   Validation, normalization, and default generation for SystemSettings.
*/

const DEFAULTS = {
    aiControls: {
        impulseSensitivity: 1,
        cognitiveFriction: "balanced",
        predictiveRiskSensitivity: "balanced",
        autoAdjustment: true,
    },
    riskGovernance: {
        highRiskThreshold: 15,
        lockStartTime: "23:00",
        lockEndTime: "06:00",
        categoryWeights: { leisure: 40, essentials: 15, enterprise: 45 },
        lateNightAutoControl: false,
    },
    security: {
        twoFAEnabled: true,
        biometricEnabled: true,
        sessionTimeout: "30m",
    },
    notifications: {
        impulseSpikes: true,
        riskEscalation: true,
        stabilityWarnings: true,
        goalTracking: true,
        weeklySummary: true,
        systemReports: false,
    },
};

/* ── Normalize category weights so they always sum to 100 ── */
function normalizeWeights(weights) {
    const l = Math.max(0, weights?.leisure ?? 40);
    const e = Math.max(0, weights?.essentials ?? 15);
    const n = Math.max(0, weights?.enterprise ?? 45);
    const total = l + e + n || 1;
    return {
        leisure: Math.round((l / total) * 100),
        essentials: Math.round((e / total) * 100),
        enterprise: Math.round((n / total) * 100),
    };
}

/* ── Clamp a number between min and max ── */
function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

/* ── Validate & sanitize a full settings update payload ── */
function validateSettings(payload) {
    const clean = {};

    // AI Controls
    if (payload.aiControls) {
        clean.aiControls = {
            impulseSensitivity: clamp(Math.round(payload.aiControls.impulseSensitivity ?? 1), 0, 2),
            cognitiveFriction: ["minimal", "balanced", "aggressive"].includes(payload.aiControls.cognitiveFriction)
                ? payload.aiControls.cognitiveFriction
                : "balanced",
            predictiveRiskSensitivity: ["minimal", "balanced", "aggressive"].includes(payload.aiControls.predictiveRiskSensitivity)
                ? payload.aiControls.predictiveRiskSensitivity
                : "balanced",
            autoAdjustment: Boolean(payload.aiControls.autoAdjustment),
        };
    }

    // Risk Governance
    if (payload.riskGovernance) {
        const rg = payload.riskGovernance;
        clean.riskGovernance = {
            highRiskThreshold: clamp(rg.highRiskThreshold ?? 15, 1, 100),
            lockStartTime: /^\d{2}:\d{2}$/.test(rg.lockStartTime) ? rg.lockStartTime : "23:00",
            lockEndTime: /^\d{2}:\d{2}$/.test(rg.lockEndTime) ? rg.lockEndTime : "06:00",
            categoryWeights: normalizeWeights(rg.categoryWeights),
            lateNightAutoControl: Boolean(rg.lateNightAutoControl),
        };
    }

    // Security
    if (payload.security) {
        clean.security = {
            twoFAEnabled: Boolean(payload.security.twoFAEnabled),
            biometricEnabled: Boolean(payload.security.biometricEnabled),
            sessionTimeout: ["15m", "30m", "1h", "4h", "24h"].includes(payload.security.sessionTimeout)
                ? payload.security.sessionTimeout
                : "30m",
        };
    }

    // Notifications
    if (payload.notifications) {
        const n = payload.notifications;
        clean.notifications = {
            impulseSpikes: Boolean(n.impulseSpikes),
            riskEscalation: Boolean(n.riskEscalation),
            stabilityWarnings: Boolean(n.stabilityWarnings),
            goalTracking: Boolean(n.goalTracking),
            weeklySummary: Boolean(n.weeklySummary),
            systemReports: Boolean(n.systemReports),
        };
    }

    return clean;
}

/* ── Sensitivity factor used by impulse engine ── */
function getSensitivityFactor(level) {
    return [0.7, 1.0, 1.4][clamp(level, 0, 2)];
}

module.exports = { DEFAULTS, normalizeWeights, validateSettings, getSensitivityFactor, clamp };
