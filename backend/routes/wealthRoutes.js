const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { premiumOnly } = require("../middleware/premiumOnly");
const {
    getOverview,
    getTrend,
    getRadar,
    getAllocation,
    getOutlook,
} = require("../controllers/wealthController");

router.get("/overview", protect, premiumOnly, getOverview);
router.get("/trend", protect, premiumOnly, getTrend);
router.get("/radar", protect, premiumOnly, getRadar);
router.get("/allocation", protect, premiumOnly, getAllocation);
router.get("/outlook", protect, premiumOnly, getOutlook);

module.exports = router;
