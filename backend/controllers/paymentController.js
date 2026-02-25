const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const User = require("../models/User");
const Payment = require("../models/Payment");

exports.createOrder = async (req, res) => {
    try {
        const options = {
            amount: 100, // ₹1 in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            await User.findByIdAndUpdate(req.user.id, {
                subscription: "premium",
                subscriptionStart: new Date(),
            });

            await Payment.create({
                userId: req.user.id,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                amount: 100,
                status: "success",
            });

            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
