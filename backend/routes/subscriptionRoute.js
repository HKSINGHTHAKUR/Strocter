const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getSubscriptionStatus,
    createIntro,
    confirmPayment,
    cancelSubscription,
} = require("../controllers/subscriptionController");

router.get("/status", protect, getSubscriptionStatus);
router.post("/create-intro", protect, createIntro);
router.post("/confirm-payment", protect, confirmPayment);
router.post("/cancel", protect, cancelSubscription);

module.exports = router;
