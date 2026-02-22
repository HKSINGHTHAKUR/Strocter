const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
            index: true,
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
        },
        type: {
            type: String,
            enum: {
                values: ["income", "expense"],
                message: "{VALUE} is not a valid transaction type",
            },
            required: [true, "Transaction type is required"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            index: true,
        },
        note: {
            type: String,
            trim: true,
        },
        emotion: {
            type: String,
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for common queries
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ user: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
