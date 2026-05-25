const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email address",
        ],
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters"],
        select: false, // exclude from queries by default
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    trialStartDate: {
        type: Date,
        default: Date.now,
    },
    trialActive: {
        type: Boolean,
        default: true,
    },
    subscriptionActive: {
        type: Boolean,
        default: false,
    },
    subscription: {
        type: String,
        enum: ["free", "premium"],
        default: "free"
    },
    subscriptionStart: Date,
    subscriptionEnd: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("User", userSchema);
