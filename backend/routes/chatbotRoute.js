const express = require("express");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/chatbot/token — returns a signed JWT for Chatbase user identity
router.get("/token", protect, async (req, res) => {
    try {
        const secret = process.env.CHATBASE_IDENTITY_SECRET;
        if (!secret) {
            return res.status(500).json({ message: "Chatbot identity secret not configured" });
        }

        const token = jwt.sign(
            {
                user_id: req.user._id.toString(),
                name: req.user.name,
                email: req.user.email,
            },
            secret,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        console.error("Chatbot token error:", error);
        res.status(500).json({ message: "Failed to generate chatbot token" });
    }
});

module.exports = router;
