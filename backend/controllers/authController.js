const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { asyncHandler } = require("../middleware/errorHandler");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error("User with this email already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        },
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email (include password field)
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                trialActive: user.trialActive ?? true,
                subscriptionActive: user.subscriptionActive ?? false,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            token,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                trialActive: user.trialActive,
                subscriptionActive: user.subscriptionActive,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Google login
// @route   GET /api/auth/google
// @access  Public
const googleLogin = (req, res, next) => {
    // Passport will handle the authentication
    const auth = require("../config/passport");
    auth.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
};

// @desc    Google login callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = (req, res, next) => {
    const auth = require("../config/passport");
    auth.authenticate("google", {
        failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login`,
    })(req, res, async (err, user) => {
        if (err || !user) {
            return res.redirect(
                `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=auth_failed`
            );
        }
        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                trialActive: user.trialActive ?? true,
                subscriptionActive: user.subscriptionActive ?? false,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        // Redirect to frontend with token
        res.redirect(
            `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/google/callback?token=${token}`
        );
    });
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // We don't want to reveal if the user exists or not for security
    if (!user) {
        return res.status(200).json({
            success: true,
            message: "If an account with that email exists, we have sent a reset link",
        });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash the token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Set expiry (10 minutes)
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send email via email service
    try {
        const emailService = require("../services/emailService");
        await emailService.sendResetPasswordEmail(user.email, resetToken);
    } catch (error) {
        console.error("Error sending reset password email:", error);
        // We don't want to expose email sending failures to the user for security
        // but we should still return success to avoid revealing whether the email exists
    }

    res.status(200).json({
        success: true,
        message: "If an account with that email exists, we have sent a reset link",
    });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    // Hash the token to compare with the stored hash
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset successful",
    });
});

module.exports = {
    register,
    login: loginUser,
    getMe,
    googleLogin,
    googleCallback,
    forgotPassword,
    resetPassword,
};
