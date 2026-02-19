const express = require("express");
const router = express.Router();
const { addTransaction } = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");
const { checkSubscription } = require("../middleware/subscriptionMiddleware");

// POST /api/transactions/add (protected)
router.post("/add", protect, checkSubscription, addTransaction);

module.exports = router;
