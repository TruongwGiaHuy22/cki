const pool = require("../../config/db");

/* ==================== CREATE REPORT ==================== */
async function createReport(userId, reason, description) {
  try {
    // Kết hợp loại báo cáo và nội dung chi tiết
    const fullContent = description ? `${reason} | ${description}` : reason;
    
    const [result] = await pool.query(
      `INSERT INTO reports (user_id, reason, statuss) 
       VALUES (?, ?, 'Đang chờ')`,
      [userId, fullContent]
    );

    return {
      report_id: result.insertId,
      message: "✅ Báo lỗi đã được gửi. Cảm ơn góp ý của bạn!"
    };
  } catch (err) {
    console.error("❌ Error createReport:", err.message);
    throw err;
  }
}

/* ==================== GET ALL REPORTS (ADMIN) ==================== */
async function getReports(limit = 20, offset = 0) {
  try {
    const [reports] = await pool.query(`
      SELECT 
        r.report_id,
        r.user_id,
        r.reason,
        r.statuss,
        r.created_at,
        u.username as user_name
      FROM reports r
      LEFT JOIN users u ON r.user_id = u.user_id
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [[count]] = await pool.query("SELECT COUNT(*) as total FROM reports");

    return {
      data: reports,
      total: count?.total || 0
    };
  } catch (err) {
    console.error("❌ Error getReports:", err.message);
    throw err;
  }
}

/* ==================== GET REPORT DETAIL ==================== */
async function getReportDetail(reportId) {
  try {
    const [report] = await pool.query(`
      SELECT 
        r.report_id,
        r.user_id,
        r.reason,
        r.statuss,
        r.created_at,
        u.username as user_name
      FROM reports r
      LEFT JOIN users u ON r.user_id = u.user_id
      WHERE r.report_id = ?
    `, [reportId]);

    return report[0] || null;
  } catch (err) {
    console.error("❌ Error getReportDetail:", err.message);
    throw err;
  }
}

/* ==================== UPDATE REPORT STATUS ==================== */
async function updateReportStatus(reportId, status) {
  try {
    const [result] = await pool.query(
      "UPDATE reports SET statuss = ? WHERE report_id = ?",
      [status, reportId]
    );
    return { success: true, message: "Report status updated" };
  } catch (err) {
    console.error("❌ Error updateReportStatus:", err.message);
    throw err;
  }
}

/* ==================== DELETE REPORT ==================== */
async function deleteReport(reportId) {
  try {
    const [result] = await pool.query("DELETE FROM reports WHERE report_id = ?", [reportId]);
    return { success: true, message: "Report deleted" };
  } catch (err) {
    console.error("❌ Error deleteReport:", err.message);
    throw err;
  }
}

module.exports = {
  createReport,
  getReports,
  getReportDetail,
  updateReportStatus,
  deleteReport
};
