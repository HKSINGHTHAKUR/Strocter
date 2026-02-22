/* ── premiumOnly.js ──
   Middleware: blocks free users whose trial has expired.
   Premium subscribers + active trial users pass through.
*/

const { hasPremiumAccess } = require("../services/subscriptionEngine");

const premiumOnly = async (req, res, next) => {
    try {
        const hasAccess = await hasPremiumAccess(req.user._id);

        if (!hasAccess) {
            return res.status(403).json({
                message: "Premium subscription required",
                code: "PREMIUM_REQUIRED",
                upgradeUrl: "/pricing",
            });
        }

        next();
    } catch (error) {
        console.error("Premium check error:", error);
        return res.status(500).json({ message: "Subscription check failed" });
    }
};

module.exports = { premiumOnly };
