/* ── subscriptionEngine.js ──
   Core subscription logic. Controllers call this, never mongoose directly.
*/

const Subscription = require("../models/Subscription");
const User = require("../models/User");

const TRIAL_DAYS = 7;
const INTRO_PRICE = 1; // ₹1
const PREMIUM_DURATION_DAYS = 30; // 1 month

/**
 * Get or lazily create a subscription record for a user.
 */
async function getOrCreateSubscription(userId) {
    let sub = await Subscription.findOne({ userId });
    if (!sub) {
        sub = await Subscription.create({ userId, plan: "free", status: "active" });
    }
    return sub;
}

/**
 * Calculate trial status from user's createdAt date.
 */
function getTrialInfo(user) {
    const created = new Date(user.createdAt);
    const now = new Date();
    const elapsed = now - created;
    const trialMs = TRIAL_DAYS * 24 * 60 * 60 * 1000;
    const remaining = Math.max(0, trialMs - elapsed);
    const daysLeft = Math.ceil(remaining / (24 * 60 * 60 * 1000));

    return {
        isTrial: remaining > 0,
        trialDaysLeft: daysLeft,
        trialExpired: remaining <= 0,
    };
}

/**
 * Full subscription status for the frontend.
 */
async function getFullStatus(userId) {
    const [sub, user] = await Promise.all([
        getOrCreateSubscription(userId),
        User.findById(userId),
    ]);

    const trial = getTrialInfo(user);
    const isPremium = sub.plan === "premium" && sub.status === "active";

    return {
        plan: sub.plan,
        status: sub.status,
        isPremium,
        isTrial: !isPremium && trial.isTrial,
        trialDaysLeft: trial.trialDaysLeft,
        trialExpired: trial.trialExpired,
        expiresAt: sub.expiresAt,
        pricePaid: sub.pricePaid,
    };
}

/**
 * Create a pending intro subscription (₹1).
 * Returns an orderId that the frontend uses to launch payment gateway.
 */
async function createIntroOrder(userId) {
    const sub = await getOrCreateSubscription(userId);

    if (sub.plan === "premium" && sub.status === "active") {
        throw new Error("Already a premium subscriber");
    }

    // Generate a unique order ID
    const orderId = `ORDER-${userId}-${Date.now()}`;

    sub.status = "pending";
    sub.pricePaid = INTRO_PRICE;
    sub.currency = "INR";
    sub.paymentProvider = "razorpay";
    sub.paymentId = orderId;
    await sub.save();

    return {
        orderId,
        amount: INTRO_PRICE * 100, // Razorpay expects paise
        currency: "INR",
        plan: "premium",
    };
}

/**
 * Activate premium after successful payment.
 */
async function activatePremium(userId, paymentData = {}) {
    const sub = await getOrCreateSubscription(userId);

    sub.plan = "premium";
    sub.status = "active";
    sub.pricePaid = INTRO_PRICE;
    sub.paymentDate = new Date();
    sub.paymentProvider = paymentData.provider || "razorpay";
    sub.paymentId = paymentData.paymentId || sub.paymentId;
    // 30-day premium access
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + PREMIUM_DURATION_DAYS);
    sub.expiresAt = expiresAt;
    await sub.save();

    // Update user model flags
    await User.findByIdAndUpdate(userId, {
        subscriptionActive: true,
        trialActive: false,
    });

    return sub;
}

/**
 * Downgrade user to free tier.
 */
async function downgradeUser(userId) {
    const sub = await getOrCreateSubscription(userId);

    sub.plan = "free";
    sub.status = "active";
    sub.expiresAt = null;
    await sub.save();

    await User.findByIdAndUpdate(userId, {
        subscriptionActive: false,
    });

    return sub;
}

/**
 * Check if a user has premium access (premium plan OR active trial).
 */
async function hasPremiumAccess(userId) {
    const [sub, user] = await Promise.all([
        getOrCreateSubscription(userId),
        User.findById(userId),
    ]);

    // Premium subscriber — check if not expired
    if (sub.plan === "premium" && sub.status === "active") {
        if (sub.expiresAt && new Date() > new Date(sub.expiresAt)) {
            // Auto-downgrade expired premium
            sub.plan = "free";
            sub.status = "expired";
            await sub.save();
            await User.findByIdAndUpdate(userId, { subscriptionActive: false });
        } else {
            return true;
        }
    }

    // Within 7-day trial
    const trial = getTrialInfo(user);
    return trial.isTrial;
}

module.exports = {
    getOrCreateSubscription,
    getTrialInfo,
    getFullStatus,
    createIntroOrder,
    activatePremium,
    downgradeUser,
    hasPremiumAccess,
    TRIAL_DAYS,
    INTRO_PRICE,
};
