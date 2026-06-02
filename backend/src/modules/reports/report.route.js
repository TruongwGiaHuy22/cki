const express = require("express");
const controller = require("./report.controller");
const authRequired = require("../../middlewares/authRequired");
const adminRequired = require("../../middlewares/adminRequired");

const router = express.Router();

// Submit a new report (requires auth)
router.post("/", authRequired, controller.submitReport);

// Get all reports (admin only)
router.get("/", authRequired, adminRequired, controller.getReports);

// Get report detail (admin only)
router.get("/:id", authRequired, adminRequired, controller.getReportDetail);

// Update report status (admin only)
router.patch("/:id", authRequired, adminRequired, controller.updateReportStatus);

// Delete report (admin only)
router.delete("/:id", authRequired, adminRequired, controller.deleteReport);

module.exports = router;
