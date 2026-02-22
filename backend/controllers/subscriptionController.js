const {
    getFullStatus,
    createIntroOrder,
    activatePremium,
    downgradeUser,
} = require("../services/subscriptionEngine");

/* GET /api/subscription/status */
exports.getSubscriptionStatus = async (req, res) => {
    try {
        const status = await getFullStatus(req.user._id);
        res.json(status);
    } catch (err) {
        console.error("Subscription status error:", err);
        res.status(500).json({ message: "Failed to fetch subscription status" });
    }
};

/* POST /api/subscription/create-intro */
exports.createIntro = async (req, res) => {
    try {
        const order = await createIntroOrder(req.user._id);
        res.json(order);
    } catch (err) {
        if (err.message === "Already a premium subscriber") {
            return res.status(400).json({ message: err.message });
        }
        console.error("Create intro error:", err);
        res.status(500).json({ message: "Failed to create order" });
    }
};

/* POST /api/subscription/confirm-payment */
exports.confirmPayment = async (req, res) => {
    try {
        const { paymentId, provider } = req.body;

        // In production: verify payment signature with Razorpay SDK here
        // For now: trust the paymentId from frontend (Razorpay integration next phase)

        const sub = await activatePremium(req.user._id, { paymentId, provider });

        res.json({
            message: "Premium activated successfully",
            plan: sub.plan,
            status: sub.status,
        });
    } catch (err) {
        console.error("Confirm payment error:", err);
        res.status(500).json({ message: "Payment confirmation failed" });
    }
};

/* POST /api/subscription/cancel */
exports.cancelSubscription = async (req, res) => {
    try {
        const sub = await downgradeUser(req.user._id);
        res.json({
            message: "Subscription cancelled. Downgraded to free.",
            plan: sub.plan,
            status: sub.status,
        });
    } catch (err) {
        console.error("Cancel subscription error:", err);
        res.status(500).json({ message: "Cancellation failed" });
    }
};
