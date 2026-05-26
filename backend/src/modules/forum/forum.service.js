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
 * Lấy danh sách bài viết
 */
exports.getAllPosts = async (category) => {
  let query = `
    SELECT fp.*, u.username, u.role,
           (SELECT COUNT(*) FROM forum_comments fc WHERE fc.post_id = fp.post_id) AS comment_count
    FROM forum_posts fp
    LEFT JOIN users u ON fp.user_id = u.user_id
  `;
  const params = [];

  if (category && category !== 'Tất cả') {
    query += ` WHERE fp.category = ?`;
    params.push(category);
  }
  
  query += ` ORDER BY fp.is_pinned DESC, fp.created_at DESC`;

  const [rows] = await db.execute(query, params);
  return rows;
};

/**
 * Lấy chi tiết một bài viết và tự động cộng 1 lượt xem
 */
exports.getPostById = async (post_id) => {
  await db.execute(`UPDATE forum_posts SET view_count = view_count + 1 WHERE post_id = ?`, [post_id]);

  const [rows] = await db.execute(
    `SELECT fp.*, u.username, u.avatar, u.role 
     FROM forum_posts fp 
     LEFT JOIN users u ON fp.user_id = u.user_id 
     WHERE fp.post_id = ?`,
    [post_id]
  );
  return rows[0];
};

exports.getNovelListLookup = async () => {
  const [rows] = await db.execute(`SELECT idln, title FROM QLTT ORDER BY title ASC`);
  return rows;
};

// ========================================================
// 💬 TẦNG XỬ LÝ BÌNH LUẬN ĐÃ TỐI ƯU HÓA
// ========================================================

exports.getCommentsByPostId = async (post_id, userId = null) => {
  try {
    console.log("=== GET COMMENTS FOR POST ===");
    console.log("post_id:", post_id, "userId:", userId);
    
    const [postRows] = await db.execute(`SELECT user_id FROM forum_posts WHERE post_id = ?`, [post_id]);
    const post_author_id = postRows[0]?.user_id;
    console.log("post_author_id:", post_author_id);

    // Lấy bình luận đơn giản
    const [rows] = await db.execute(
      `SELECT fc.*, u.username, u.avatar, u.role
       FROM forum_comments fc
       LEFT JOIN users u ON fc.user_id = u.user_id
       WHERE fc.post_id = ? AND fc.status = 'Hiện'
       ORDER BY fc.parent_id ASC, fc.created_at ASC`,
      [post_id]
    );
    
    console.log("✅ Raw comments từ DB:", rows.length, "comments");

    // Lấy user role để check admin
    let userRole = null;
    if (userId) {
      const [userRows] = await db.execute(`SELECT role FROM users WHERE user_id = ?`, [userId]);
      userRole = userRows[0]?.role;
    }

    const buildCommentTree = (comments, parentId = null) => {
      const filtered = comments.filter(c => c.parent_id === parentId);
      
      return filtered.map(comment => ({
        ...comment,
        username: comment.username || "Người dùng ẩn danh",
        is_author: comment.user_id === post_author_id,
        // Cho phép xóa nếu: chủ bình luận hoặc admin
        canDelete: userId && (userId === comment.user_id || userRole === 'Administrator'),
        replies: buildCommentTree(comments, comment.comment_id),
        user_liked: false, // Sẽ update từ frontend khi cần
        like_count: comment.like_count || 0
      }));
    };

    const result = buildCommentTree(rows);
    console.log("✅ Final comments tree length:", result.length);
    return result;
  } catch (err) {
    console.error("❌ Lỗi getCommentsByPostId:", err.message);
    throw err;
  }
};

exports.createComment = async ({ post_id, user_id, parent_id, content }) => {
  const [result] = await db.execute(
    `INSERT INTO forum_comments (post_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)`,
    [post_id, user_id, parent_id || null, content]
  );
  return { comment_id: result.insertId, post_id, user_id, parent_id, content };
};

exports.updatePost = async (post_id, user_id, { title, content, category }) => {
  const [posts] = await db.execute(`SELECT user_id FROM forum_posts WHERE post_id = ?`, [post_id]);
  if (!posts.length || posts[0].user_id !== user_id) return null;

  await db.execute(
    `UPDATE forum_posts SET title = ?, content = ?, category = ?, updated_at = NOW() WHERE post_id = ?`,
    [title, content, category, post_id]
  );
  return { post_id, user_id, title, content, category };
};

exports.deletePost = async (post_id, user_id) => {
  const [posts] = await db.execute(`SELECT user_id FROM forum_posts WHERE post_id = ?`, [post_id]);
  if (!posts.length || posts[0].user_id !== user_id) return null;
  await db.execute(`DELETE FROM forum_posts WHERE post_id = ?`, [post_id]);
  return true;
};

exports.deleteComment = async (comment_id, user_id) => {
  const [comments] = await db.execute(
    `SELECT fc.user_id FROM forum_comments fc WHERE fc.comment_id = ?`, 
    [comment_id]
  );
  
  if (!comments.length) return null;
  
  const [users] = await db.execute(`SELECT role FROM users WHERE user_id = ?`, [user_id]);
  const isAdmin = users.length > 0 && users[0].role === 'Administrator';
  const isOwner = comments[0].user_id === user_id;
  
  // Chỉ cho phép xóa nếu là chủ bình luận hoặc admin
  if (!isOwner && !isAdmin) return null;
  
  await db.execute(`DELETE FROM forum_comments WHERE comment_id = ?`, [comment_id]);
  return true;
};

exports.likeComment = async (comment_id, user_id) => {
  try {
    console.log("🔍 likeComment - comment_id:", comment_id, "user_id:", user_id);
    
    // Kiểm tra comment tồn tại
    const [commentExists] = await db.execute(
      `SELECT comment_id, like_count FROM forum_comments WHERE comment_id = ?`,
      [comment_id]
    );
    
    if (!commentExists.length) {
      throw new Error("Comment không tồn tại");
    }
    
    const userIdInt = parseInt(user_id, 10);
    if (isNaN(userIdInt)) {
      throw new Error("user_id không hợp lệ");
    }
    
    const currentLikeCount = commentExists[0].like_count || 0;
    
    // Thử dùng table likes nếu tồn tại
    let likeTrackingWorked = false;
    try {
      const [existing] = await db.execute(
        `SELECT id FROM forum_comment_likes WHERE comment_id = ? AND user_id = ?`,
        [comment_id, userIdInt]
      );

      console.log("Existing like:", existing.length > 0);

      if (existing.length > 0) {
        // Bỏ like
        await db.execute(
          `DELETE FROM forum_comment_likes WHERE comment_id = ? AND user_id = ?`, 
          [comment_id, userIdInt]
        );
        console.log("✅ Bỏ like thành công");
        // Cập nhật like_count
        await db.execute(
          `UPDATE forum_comments SET like_count = like_count - 1 WHERE comment_id = ?`,
          [comment_id]
        );
      } else {
        // Thêm like
        await db.execute(
          `INSERT INTO forum_comment_likes (comment_id, user_id) VALUES (?, ?)`, 
          [comment_id, userIdInt]
        );
        console.log("✅ Thêm like thành công");
        // Cập nhật like_count
        await db.execute(
          `UPDATE forum_comments SET like_count = like_count + 1 WHERE comment_id = ?`,
          [comment_id]
        );
      }
      likeTrackingWorked = true;
    } catch (likeErr) {
      console.warn("⚠️ Table forum_comment_likes không tồn tại, fallback sang like_count simple tracking");
      // Fallback: chỉ toggle like_count, không track individual users
      likeTrackingWorked = false;
    }
    
    // Lấy like_count mới nhất
    const [updated] = await db.execute(
      `SELECT like_count FROM forum_comments WHERE comment_id = ?`, 
      [comment_id]
    );
    
    const likeCount = updated[0]?.like_count || 0;
    console.log("New like count:", likeCount);
    
    return { 
      like_count: likeCount, 
      user_liked: likeTrackingWorked ? (currentLikeCount < likeCount) : undefined
    };
  } catch (err) {
    console.error("❌ Lỗi likeComment:", err.message);
    throw err;
  }
};