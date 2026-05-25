const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { asyncHandler } = require("../middleware/errorHandler");

// Twilio Verify client (lazy-loaded)
let twilioClient = null;
function getTwilioClient() {
    if (!twilioClient) {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        if (!accountSid || !authToken || accountSid === "your_twilio_account_sid") {
            throw new Error("Twilio credentials not configured in .env");
        }
        twilioClient = require("twilio")(accountSid, authToken);
    }
    return twilioClient;
}

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
    const passport = require("../config/passport");
    passport.authenticate("google", { 
        scope: ["profile", "email"],
        prompt: "select_account" // Forces Google to show the account picker every time
    })(req, res, next);
};

// @desc    Google login callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = (req, res, next) => {
    const passport = require("../config/passport");
    passport.authenticate("google", (err, user, info) => {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

        if (err || !user) {
            console.error("Google OAuth error:", err || info);
            return res.redirect(`${frontendUrl}/login?error=auth_failed`);
        }

        // Log the user in via Passport session (needed for serializeUser)
        req.logIn(user, (loginErr) => {
            if (loginErr) {
                console.error("Passport login error:", loginErr);
                return res.redirect(`${frontendUrl}/login?error=auth_failed`);
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
            res.redirect(`${frontendUrl}/auth/google/callback?token=${token}`);
        });
    })(req, res, next);
};

// @desc    Send OTP to phone number
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = asyncHandler(async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        res.status(400);
        throw new Error("Phone number is required");
    }

    // Validate E.164 format (e.g. +919876543210)
    const e164Regex = /^\+[1-9]\d{6,14}$/;
    if (!e164Regex.test(phone)) {
        res.status(400);
        throw new Error("Phone number must be in E.164 format (e.g. +919876543210)");
    }

    try {
        const client = getTwilioClient();
        const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

        if (!verifySid || verifySid === "your_twilio_verify_service_sid") {
            res.status(500);
            throw new Error("Twilio Verify service not configured");
        }

        await client.verify.v2
            .services(verifySid)
            .verifications.create({ to: phone, channel: "sms" });

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.error("Twilio send OTP error:", error);
        if (error.code === 60200) {
            res.status(400);
            throw new Error("Invalid phone number");
        }
        if (error.code === 60203) {
            res.status(429);
            throw new Error("Too many OTP requests. Please wait before trying again.");
        }
        res.status(500);
        throw new Error(error.message || "Failed to send OTP");
    }
});

// @desc    Verify OTP and login/register
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
    const { phone, code } = req.body;

    if (!phone || !code) {
        res.status(400);
        throw new Error("Phone number and OTP code are required");
    }

    try {
        const client = getTwilioClient();
        const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

        const verificationCheck = await client.verify.v2
            .services(verifySid)
            .verificationChecks.create({ to: phone, code });

        if (verificationCheck.status !== "approved") {
            res.status(401);
            throw new Error("Invalid or expired OTP");
        }

        // OTP verified — find or create user
        let user = await User.findOne({ phone });

        if (!user) {
            // Auto-create user on first phone login
            user = await User.create({
                name: `User-${phone.slice(-4)}`,
                phone,
            });
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
        console.error("Twilio verify OTP error:", error);
        if (error.status === 404) {
            res.status(400);
            throw new Error("OTP expired or not found. Please request a new one.");
        }
        if (res.statusCode === 200) res.status(500);
        throw error;
    }
});

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
    sendOtp,
    verifyOtp,
};
