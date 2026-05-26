const pool = require('./db');

/**
 * Khởi tạo các bảng forum_comment_likes nếu chưa tồn tại
 */
async function initializeForum() {
  try {
    console.log("🔄 Kiểm tra và khởi tạo Forum tables...");
    
    // Tạo table forum_comment_likes nếu chưa tồn tại
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS forum_comment_likes (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        comment_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_forum_like (comment_id, user_id),
        FOREIGN KEY (comment_id) REFERENCES forum_comments(comment_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);
    
    console.log("✅ Table forum_comment_likes sẵn sàng");
    return true;
  } catch (err) {
    console.warn("⚠️ Lỗi khởi tạo forum tables:", err.message);
    return false;
  }
}

module.exports = { initializeForum };
