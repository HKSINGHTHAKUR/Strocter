const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getOverview,
    getTrend,
    getRadar,
    getAllocation,
    getOutlook,
} = require("../controllers/wealthController");

router.get("/overview", protect, getOverview);
router.get("/trend", protect, getTrend);
router.get("/radar", protect, getRadar);
router.get("/allocation", protect, getAllocation);
router.get("/outlook", protect, getOutlook);

module.exports = router;
