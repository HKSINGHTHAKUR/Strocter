const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Check trial expiry
        const trialExpiry = new Date(user.trialStartDate);
        trialExpiry.setDate(trialExpiry.getDate() + 7);

        if (new Date() > trialExpiry && !user.subscriptionActive) {
            return res.status(403).json({ message: "Free trial expired. Please subscribe." });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token failed" });
    }
};

module.exports = { protect };

