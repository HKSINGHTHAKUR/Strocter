const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
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
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);
