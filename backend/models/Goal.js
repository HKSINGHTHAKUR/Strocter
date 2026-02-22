const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["behavioral", "savings", "risk"], default: "behavioral" },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    horizon: { type: String, enum: ["30D", "60D", "90D"], default: "60D" },
    riskTolerance: { type: String, enum: ["low", "moderate", "aggressive"], default: "moderate" },
    aiSuggestions: { type: Boolean, default: true },
    milestones: [
        {
            quarter: { type: String },
            status: { type: String, enum: ["achieved", "active", "pending"], default: "pending" },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Goal", goalSchema);
