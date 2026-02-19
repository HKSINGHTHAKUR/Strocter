const User = require("../models/User");

const activateSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.trialActive = false;
        user.subscriptionActive = true;
        await user.save();

        return res.status(200).json({ message: "Subscription activated" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { activateSubscription };
