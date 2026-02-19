const User = require("../models/User");

const checkSubscription = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.trialActive && !user.subscriptionActive) {
            return res.status(403).json({ message: "Trial expired. Please subscribe." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { checkSubscription };
