const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getOverview,
    getTimeline,
    runSimulation,
} = require("../controllers/impulseController");

router.get("/overview", protect, getOverview);
router.get("/timeline", protect, getTimeline);
router.post("/simulate", protect, runSimulation);

module.exports = router;
