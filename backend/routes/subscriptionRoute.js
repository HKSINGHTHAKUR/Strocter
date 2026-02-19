const express = require("express");
const router = express.Router();
const { activateSubscription } = require("../controllers/subscriptionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/activate", protect, activateSubscription);

module.exports = router;
