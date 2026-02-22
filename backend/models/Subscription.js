const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        plan: {
            type: String,
            enum: ["free", "premium"],
            default: "free",
        },
        pricePaid: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: "INR",
        },
        status: {
            type: String,
            enum: ["active", "cancelled", "expired", "pending"],
            default: "active",
        },
        paymentProvider: {
            type: String,
            default: null,
        },
        paymentId: {
            type: String,
            default: null,
        },
        paymentDate: {
            type: Date,
            default: null,
        },
        expiresAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// One subscription per user
subscriptionSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
