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

/**
 * Khởi tạo table novel_publish
 */
async function initializeNovelPublish() {
  try {
    console.log("🔄 Kiểm tra và khởi tạo Novel Publish table...");
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS novel_publish (
        publish_id INT PRIMARY KEY AUTO_INCREMENT,
        idln INT NOT NULL,
        volume_number INT DEFAULT 1,
        title VARCHAR(255),
        cover VARCHAR(255),
        publisher_name VARCHAR(255),
        author_name VARCHAR(255),
        illustrator_name VARCHAR(255),
        translator_name VARCHAR(255),
        total_pages INT,
        release_date DATE,
        price DECIMAL(10, 2),
        short_description TEXT,
        buy_link VARCHAR(500),
        store_name VARCHAR(255),
        active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY(idln) REFERENCES QLTT(idln) ON DELETE CASCADE
      )
    `);
    
    console.log("✅ Table novel_publish sẵn sàng");
    return true;
  } catch (err) {
    console.warn("⚠️ Lỗi khởi tạo novel_publish table:", err.message);
    return false;
  }
}

module.exports = { initializeForum, initializeNovelPublish };
