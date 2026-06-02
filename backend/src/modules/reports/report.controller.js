const service = require("./report.service");

/* ==================== CREATE REPORT ==================== */
async function submitReport(req, res, next) {
  try {
    const userId = req.user?.sub || req.user?.user_id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Bạn phải đăng nhập để gửi báo lỗi" });
    }

    const { reason, description } = req.body;

    // Validate input
    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập loại báo lỗi" });
    }

    const result = await service.createReport(userId, reason, description);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/* ==================== GET ALL REPORTS (ADMIN) ==================== */
async function getReports(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const result = await service.getReports(limit, offset);
    res.json({ success: true, data: result.data, total: result.total });
  } catch (err) {
    next(err);
  }
}

/* ==================== GET REPORT DETAIL (ADMIN) ==================== */
async function getReportDetail(req, res, next) {
  try {
    const reportId = Number(req.params.id);
    const result = await service.getReportDetail(reportId);
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Báo cáo không tìm thấy" });
    }
    
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/* ==================== UPDATE REPORT STATUS (ADMIN) ==================== */
async function updateReportStatus(req, res, next) {
  try {
    const reportId = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Vui lòng cung cấp trạng thái mới" });
    }

    const result = await service.updateReportStatus(reportId, status);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/* ==================== DELETE REPORT (ADMIN) ==================== */
async function deleteReport(req, res, next) {
  try {
    const reportId = Number(req.params.id);
    const result = await service.deleteReport(reportId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitReport,
  getReports,
  getReportDetail,
  updateReportStatus,
  deleteReport
};
