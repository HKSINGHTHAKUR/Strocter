const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { premiumOnly } = require("../middleware/premiumOnly");
const {
    getOverview,
    getTimeline,
    runSimulation,
} = require("../controllers/impulseController");

router.get("/overview", protect, premiumOnly, getOverview);
router.get("/timeline", protect, premiumOnly, getTimeline);
router.post("/simulate", protect, premiumOnly, runSimulation);

module.exports = router;
