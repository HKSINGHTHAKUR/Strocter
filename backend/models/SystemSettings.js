const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },

        aiControls: {
            impulseSensitivity: { type: Number, default: 1, min: 0, max: 2 },
            cognitiveFriction: { type: String, default: "balanced", enum: ["minimal", "balanced", "aggressive"] },
            predictiveRiskSensitivity: { type: String, default: "balanced", enum: ["minimal", "balanced", "aggressive"] },
            autoAdjustment: { type: Boolean, default: true },
        },

        riskGovernance: {
            highRiskThreshold: { type: Number, default: 15, min: 1, max: 100 },
            lockStartTime: { type: String, default: "23:00" },
            lockEndTime: { type: String, default: "06:00" },
            categoryWeights: {
                leisure: { type: Number, default: 40 },
                essentials: { type: Number, default: 15 },
                enterprise: { type: Number, default: 45 },
            },
            lateNightAutoControl: { type: Boolean, default: false },
        },

        security: {
            twoFAEnabled: { type: Boolean, default: true },
            biometricEnabled: { type: Boolean, default: true },
            sessionTimeout: { type: String, default: "30m", enum: ["15m", "30m", "1h", "4h", "24h"] },
        },

        notifications: {
            impulseSpikes: { type: Boolean, default: true },
            riskEscalation: { type: Boolean, default: true },
            stabilityWarnings: { type: Boolean, default: true },
            goalTracking: { type: Boolean, default: true },
            weeklySummary: { type: Boolean, default: true },
            systemReports: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SystemSettings", systemSettingsSchema);
