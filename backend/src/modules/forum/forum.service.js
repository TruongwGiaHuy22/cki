const db = require('../../config/db');

/**
 * Tạo bài viết / chủ đề thảo luận mới
 */
exports.createPost = async ({ user_id, title, content, category, idln }) => {
  const [result] = await db.execute(
    `INSERT INTO forum_posts (user_id, title, content, category, idln) VALUES (?, ?, ?, ?, ?)`,
    [user_id, title, content, category, idln || null]
  );
  return { post_id: result.insertId, user_id, title, content, category, idln };
};

/**
 * Lấy danh sách bài viết (Có JOIN với bảng users lấy thông tin người đăng và COUNT số bình luận)
 */
exports.getAllPosts = async (category) => {
  let query = `
    SELECT fp.*, u.username, u.role,
           (SELECT COUNT(*) FROM forum_comments fc WHERE fc.post_id = fp.post_id) AS comment_count
    FROM forum_posts fp
    JOIN users u ON fp.user_id = u.user_id
  `;
  const params = [];

  if (category && category !== 'Tất cả') {
    query += ` WHERE fp.category = ?`;
    params.push(category);
  }
  
  // Ưu tiên bài được ghim (is_pinned = 1) lên đầu, sau đó mới đến ngày tạo mới nhất
  query += ` ORDER BY fp.is_pinned DESC, fp.created_at DESC`;

  const [rows] = await db.execute(query, params);
  return rows;
};

/**
 * Lấy chi tiết một bài viết bằng ID và tự động cộng 1 lượt xem
 */
exports.getPostById = async (post_id) => {
  // Tăng view trước
  await db.execute(`UPDATE forum_posts SET view_count = view_count + 1 WHERE post_id = ?`, [post_id]);

  // Lấy data bài viết
  const [rows] = await db.execute(
    `SELECT fp.*, u.username, u.avatar, u.role 
     FROM forum_posts fp 
     JOIN users u ON fp.user_id = u.user_id 
     WHERE fp.post_id = ?`,
    [post_id]
  );
  return rows[0];
};

/**
 * 💡 BỔ SUNG: Lấy danh sách ID và Tên truyện rút gọn từ bảng QLTT
 * Dùng để hiển thị danh sách cho người dùng lựa chọn gắn thẻ truyện khi viết bài mới
 */
exports.getNovelListLookup = async () => {
  const [rows] = await db.execute(
    `SELECT idln, title FROM QLTT ORDER BY title ASC`
  );
  return rows;
};

// ========================================================
// 💬 TẦNG XỬ LÝ BÌNH LUẬN TRONG THẢO LUẬN (forum_comments)
// ========================================================

/**
 * Lấy danh sách bình luận của một bài viết cụ thể (Chỉ lấy trạng thái 'Hiện')
 */
exports.getCommentsByPostId = async (post_id) => {
  const [rows] = await db.execute(
    `SELECT fc.*, u.username, u.avatar, u.role 
     FROM forum_comments fc
     JOIN users u ON fc.user_id = u.user_id
     WHERE fc.post_id = ? AND fc.status = 'Hiện'
     ORDER BY fc.created_at ASC`,
    [post_id]
  );
  return rows;
};

/**
 * Tạo bình luận mới hoặc phản hồi (Reply) cấp con
 */
exports.createComment = async ({ post_id, user_id, parent_id, content }) => {
  const [result] = await db.execute(
    `INSERT INTO forum_comments (post_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)`,
    [post_id, user_id, parent_id || null, content]
  );
  return { comment_id: result.insertId, post_id, user_id, parent_id, content };
};

/**
 * Chỉnh sửa bài viết (chỉ người đăng mới được sửa)
 */
exports.updatePost = async (post_id, user_id, { title, content, category }) => {
  // Kiểm tra quyền sở hữu bài viết
  const [posts] = await db.execute(
    `SELECT user_id FROM forum_posts WHERE post_id = ?`,
    [post_id]
  );

  if (!posts.length || posts[0].user_id !== user_id) {
    return null; // Không có quyền
  }

  await db.execute(
    `UPDATE forum_posts SET title = ?, content = ?, category = ?, updated_at = NOW() WHERE post_id = ?`,
    [title, content, category, post_id]
  );

  return { post_id, user_id, title, content, category };
};

/**
 * Xóa bài viết (chỉ người đăng mới được xóa)
 */
exports.deletePost = async (post_id, user_id) => {
  // Kiểm tra quyền sở hữu bài viết
  const [posts] = await db.execute(
    `SELECT user_id FROM forum_posts WHERE post_id = ?`,
    [post_id]
  );

  if (!posts.length || posts[0].user_id !== user_id) {
    return null; // Không có quyền
  }

  await db.execute(
    `DELETE FROM forum_posts WHERE post_id = ?`,
    [post_id]
  );

  return true;
};