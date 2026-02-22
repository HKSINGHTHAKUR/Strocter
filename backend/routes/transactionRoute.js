const express = require("express");
const router = express.Router();
const {
    addTransaction,
    getTransactionMetrics,
    getTransactionHistory,
} = require("../controllers/transactionController");
const { getIntelligenceFeed } = require("../controllers/intelligenceFeedController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/transactions/add (protected)
router.post("/add", protect, addTransaction);

// GET /api/transactions/metrics (protected)
router.get("/metrics", protect, getTransactionMetrics);

// GET /api/transactions/history (protected)
router.get("/history", protect, getTransactionHistory);

// GET /api/transactions/intelligence-feed (protected)
router.get("/intelligence-feed", protect, getIntelligenceFeed);

module.exports = router;
