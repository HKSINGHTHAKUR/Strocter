const express = require("express");
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware"); // assuming standard auth middleware exists

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;
