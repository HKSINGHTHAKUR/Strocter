const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { premiumOnly } = require("../middleware/premiumOnly");
const { getArchiveOverview, getArchiveReports, getReportPreview } = require("../controllers/archiveController");

router.get("/overview", protect, premiumOnly, getArchiveOverview);
router.get("/reports", protect, premiumOnly, getArchiveReports);
router.get("/:id/preview", protect, premiumOnly, getReportPreview);

module.exports = router;
