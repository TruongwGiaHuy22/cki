const pool = require('../../config/db');

exports.getHistory = async (req, res) => {
  try {
    const user_id = req.user?.sub;
    if (!user_id) return res.status(401).json({ message: "Chưa đăng nhập" });

    // Lấy lịch sử grouped by novel (thương đã đọc), lấy mới nhất lên đầu
    const [history] = await pool.query(`
      SELECT 
        q.idln,
        q.title,
        q.cover,
        q.slug,
        q.author,
        q.description,
        MAX(rh.last_read_at) as last_read_at,
        COUNT(*) as total_chapters_read
      FROM reading_history rh
      JOIN QLTT q ON rh.idln = q.idln
      WHERE rh.user_id = ?
      GROUP BY rh.idln, q.idln
      ORDER BY MAX(rh.last_read_at) DESC
      LIMIT 20
    `, [user_id]);

    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm lịch sử đọc truyện
exports.addHistory = async (req, res) => {
  try {
    const user_id = req.user?.sub;
    if (!user_id) return res.status(401).json({ message: "Chưa đăng nhập" });

    const { idln, chapter_id } = req.body;
    if (!idln || !chapter_id) {
      return res.status(400).json({ message: "Thiếu idln hoặc chapter_id" });
    }

    // Thêm hoặc update lịch sử đọc
    await pool.query(`
      INSERT INTO reading_history (user_id, idln, chapter_id, last_read_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON DUPLICATE KEY UPDATE last_read_at = CURRENT_TIMESTAMP
    `, [user_id, idln, chapter_id]);

    res.json({ success: true, message: "Đã lưu lịch sử đọc" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};