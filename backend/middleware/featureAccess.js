const User = require("../models/User");

const checkFeatureAccess = async (req, res, next) => {
    try {
        const user = req.user;

        if (user.subscriptionActive === true) {
            return next();
        }

        if (!user.trialStartDate) {
            return next();
        }

        const trialEndDate = new Date(user.trialStartDate);
        trialEndDate.setDate(trialEndDate.getDate() + 7);

        if (new Date() <= trialEndDate) {
            return next();
        }

        return res.status(403).json({
            message: "Premium feature locked. Trial expired. Please subscribe.",
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = checkFeatureAccess;
