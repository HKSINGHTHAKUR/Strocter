const express = require("express");
const router = express.Router();
const { addTransaction } = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/transactions/add (protected)
router.post("/add", protect, addTransaction);

module.exports = router;
