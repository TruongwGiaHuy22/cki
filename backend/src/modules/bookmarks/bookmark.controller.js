const pool = require('../../config/db');

// Lấy danh sách bookmarks của user
exports.getBookmarks = async (req, res) => {
  try {
    const user_id = req.user?.sub;
    console.log("🔖 getBookmarks - user_id:", user_id);
    
    if (!user_id) return res.status(401).json({ message: "Chưa đăng nhập" });

    // Kiểm tra bookmarks trong DB
    const [bookmarksCheck] = await pool.query(`
      SELECT * FROM bookmarks WHERE user_id = ?
    `, [user_id]);
    
    console.log("📌 Raw bookmarks:", bookmarksCheck);

    // Nếu không có bookmark, trả về array rỗng
    if (bookmarksCheck.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Lấy chi tiết truyện
    const [bookmarks] = await pool.query(`
      SELECT 
        q.idln,
        q.title,
        q.cover,
        q.slug,
        q.author,
        q.description,
        b.created_at
      FROM bookmarks b
      LEFT JOIN QLTT q ON b.idln = q.idln
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
      LIMIT 100
    `, [user_id]);

    console.log("📚 Bookmarks with details:", bookmarks);

    res.json({ success: true, data: bookmarks || [] });
  } catch (err) {
    console.error("❌ getBookmarks error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Thêm bookmark
exports.addBookmark = async (req, res) => {
  try {
    const user_id = req.user?.sub;
    console.log("🔖 addBookmark - user_id:", user_id);
    
    if (!user_id) return res.status(401).json({ message: "Chưa đăng nhập" });

    const { idln } = req.body;
    console.log("📌 Adding bookmark for idln:", idln);
    
    if (!idln) {
      return res.status(400).json({ message: "Thiếu idln" });
    }

    // Thêm bookmark
    const result = await pool.query(`
      INSERT INTO bookmarks (user_id, idln)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP
    `, [user_id, idln]);

    console.log("✅ Bookmark added/updated");
    res.json({ success: true, message: "Đã lưu truyện" });
  } catch (err) {
    console.error("❌ addBookmark error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Xóa bookmark
exports.removeBookmark = async (req, res) => {
  try {
    const user_id = req.user?.sub;
    if (!user_id) return res.status(401).json({ message: "Chưa đăng nhập" });

    const { idln } = req.body;
    if (!idln) {
      return res.status(400).json({ message: "Thiếu idln" });
    }

    await pool.query(`
      DELETE FROM bookmarks WHERE user_id = ? AND idln = ?
    `, [user_id, idln]);

    res.json({ success: true, message: "Đã xóa khỏi đánh dấu" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Kiểm tra xem truyện có được bookmark không
exports.checkBookmark = async (req, res) => {
  try {
    const user_id = req.user?.sub;
    if (!user_id) return res.status(401).json({ message: "Chưa đăng nhập" });

    const { idln } = req.query;
    if (!idln) {
      return res.status(400).json({ message: "Thiếu idln" });
    }

    const [result] = await pool.query(`
      SELECT COUNT(*) as count FROM bookmarks WHERE user_id = ? AND idln = ?
    `, [user_id, idln]);

    const isBookmarked = result[0].count > 0;
    res.json({ success: true, isBookmarked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
