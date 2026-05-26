const pool = require("../../config/db");

async function getCommentsByNovel(idln, limit = 20, offset = 0, userId = null) {
  try {
    // Fetch tất cả comments (both top-level và nested)
    const [allComments] = await pool.query(
      `SELECT c.comment_id, c.user_id, c.idln, c.chapter_id, c.parent_id, 
              c.content, c.like_count, c.status, c.created_at, c.updated_at,
              u.username, u.email, u.role,
              qltt.created_by,
              CASE WHEN c.user_id = qltt.created_by THEN 1 ELSE 0 END AS is_author
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.user_id
       LEFT JOIN QLTT qltt ON c.idln = qltt.idln
       WHERE c.idln = ? AND c.status = 'Hiện'
       ORDER BY c.created_at DESC`,
      [idln]
    );

    // Map all comments
    const commentMap = new Map();
    const mappedComments = allComments.map(c => ({
      comment_id: c.comment_id,
      user_id: c.user_id,
      idln: c.idln,
      chapter_id: c.chapter_id,
      parent_id: c.parent_id,
      content: c.content,
      like_count: c.like_count,
      status: c.status,
      created_at: c.created_at,
      updated_at: c.updated_at,
      user_name: c.username,
      user_email: c.email,
      is_author: !!c.is_author,
      canDelete: userId === c.user_id || userId === c.created_by,
      replies: []
    }));

    // Build comment map for quick lookup
    mappedComments.forEach(c => commentMap.set(c.comment_id, c));

    // Build tree structure - connect children to parents
    const topLevelComments = [];
    mappedComments.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        topLevelComments.push(comment);
      }
    });

    // Sort replies by created_at
    topLevelComments.forEach(comment => {
      const sortReplies = (replies) => {
        replies.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        replies.forEach(r => {
          if (r.replies.length > 0) sortReplies(r.replies);
        });
      };
      if (comment.replies.length > 0) sortReplies(comment.replies);
    });

    return topLevelComments;
  } catch (err) {
    console.error("❌ Lỗi tại getCommentsByNovel:", err.message);
    throw new Error(`Error fetching comments: ${err.message}`);
  }
}

async function createComment(payload, userId) {
  try {
    const { content, idln, chapter_id, parent_id } = payload;
    
    const [result] = await pool.query(
      `INSERT INTO comments (user_id, idln, chapter_id, parent_id, content, status)
       VALUES (?, ?, ?, ?, ?, 'Hiện')`,
      [userId, idln, chapter_id || null, parent_id || null, content]
    );

    // Lấy lại dữ liệu comment vừa tạo để trả về ngay lập tức cho giao diện hiển thị
    const [comment] = await pool.query(
      `SELECT c.comment_id, c.user_id, c.idln, c.chapter_id, c.parent_id, 
              c.content, c.like_count, c.status, c.created_at, c.updated_at,
              u.username, u.email, u.role,
              qltt.created_by,
              CASE WHEN c.user_id = qltt.created_by THEN 1 ELSE 0 END AS is_author
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.user_id
       LEFT JOIN QLTT qltt ON c.idln = qltt.idln
       WHERE c.comment_id = ?`,
      [result.insertId]
    );

    if (comment.length === 0) {
      throw new Error("Failed to create comment");
    }

    const created = comment[0];
    return {
      ...created,
      user_name: created.username,
      user_email: created.email,
      is_author: !!created.is_author,
      replies: []
    };
  } catch (err) {
    console.error("❌ Lỗi tại createComment:", err.message);
    throw new Error(`Error creating comment: ${err.message}`);
  }
}

async function updateComment(commentId, userId, payload) {
  try {
    // Kiểm tra quyền sở hữu
    const [existing] = await pool.query(
      `SELECT user_id FROM comments WHERE comment_id = ?`,
      [commentId]
    );

    if (existing.length === 0) {
      throw new Error("Comment not found");
    }

    if (existing[0].user_id !== userId) {
      throw new Error("Unauthorized");
    }

    const { content, status } = payload;
    
    if (content) {
      await pool.query(
        `UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE comment_id = ?`,
        [content, commentId]
      );
    }

    if (status) {
      await pool.query(
        `UPDATE comments SET status = ? WHERE comment_id = ?`,
        [status, commentId]
      );
    }

    const [updated] = await pool.query(
      `SELECT c.comment_id, c.user_id, c.idln, c.chapter_id, c.parent_id, 
              c.content, c.like_count, c.status, c.created_at, c.updated_at,
              u.username, u.email, u.role,
              qltt.created_by,
              CASE WHEN c.user_id = qltt.created_by THEN 1 ELSE 0 END AS is_author
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.user_id
       LEFT JOIN QLTT qltt ON c.idln = qltt.idln
       WHERE c.comment_id = ?`,
      [commentId]
    );

    if (updated.length === 0) {
      throw new Error("Comment not found after update");
    }

    const upd = updated[0];
    return {
      ...upd,
      user_name: upd.username,
      user_email: upd.email,
      is_author: !!upd.is_author
    };
  } catch (err) {
    console.error("❌ Lỗi tại updateComment:", err.message);
    throw new Error(`Error updating comment: ${err.message}`);
  }
}

async function deleteComment(commentId, userId) {
  try {
    // Kiểm tra bình luận có tồn tại không
    const [existing] = await pool.query(
      `SELECT c.user_id, c.parent_id, c.idln, qltt.created_by
       FROM comments c
       LEFT JOIN QLTT qltt ON c.idln = qltt.idln
       WHERE c.comment_id = ?`,
      [commentId]
    );

    if (existing.length === 0) {
      throw new Error("Comment not found");
    }

    const comment = existing[0];
    
    // Cho phép xóa nếu:
    // 1. User là người tạo bình luận
    // 2. User là tác giả của truyện
    const isCommentOwner = comment.user_id === userId;
    const isNovelAuthor = comment.created_by === userId;
    
    if (!isCommentOwner && !isNovelAuthor) {
      throw new Error("Unauthorized");
    }

    // Xóa comment gốc và toàn bộ reply của nó
    await pool.query(
      `DELETE FROM comments WHERE comment_id = ? OR parent_id = ?`,
      [commentId, commentId]
    );

    return { success: true };
  } catch (err) {
    console.error("❌ Lỗi tại deleteComment:", err.message);
    throw new Error(`Error deleting comment: ${err.message}`);
  }
}

async function likeComment(commentId, userId) {
  try {
    const [liked] = await pool.query(
      `SELECT * FROM comment_likes WHERE comment_id = ? AND user_id = ?`,
      [commentId, userId]
    );

    if (liked.length > 0) {
      // Bỏ thích
      await pool.query(
        `DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?`,
        [commentId, userId]
      );
      
      await pool.query(
        `UPDATE comments SET like_count = like_count - 1 WHERE comment_id = ?`,
        [commentId]
      );
    } else {
      // Thêm thích
      await pool.query(
        `INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)`,
        [commentId, userId]
      );
      
      await pool.query(
        `UPDATE comments SET like_count = like_count + 1 WHERE comment_id = ?`,
        [commentId]
      );
    }

    const [updated] = await pool.query(
      `SELECT c.comment_id, c.like_count, 
              EXISTS(SELECT 1 FROM comment_likes WHERE comment_id = ? AND user_id = ?) as isLiked
       FROM comments c
       WHERE c.comment_id = ?`,
      [commentId, userId, commentId]
    );

    return updated[0];
  } catch (err) {
    console.error("❌ Lỗi tại likeComment:", err.message);
    throw new Error(`Error liking comment: ${err.message}`);
  }
}

async function getRecentComments(limit = 3) {
  try {
    const [comments] = await pool.query(
      `SELECT c.comment_id, c.user_id, c.idln, c.content, c.created_at,
              u.username, 
              q.title as novel_title
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.user_id
       LEFT JOIN QLTT q ON c.idln = q.idln
       WHERE c.status = 'Hiện'
       ORDER BY c.created_at DESC
       LIMIT ?`,
      [limit]
    );

    return comments.map(c => ({
      id: c.comment_id,
      user_id: c.user_id,
      novel_id: c.idln,
      content: c.content,
      created_at: c.created_at,
      user_name: c.username || 'Ẩn danh',
      novel_title: c.novel_title || 'Không xác định'
    }));
  } catch (err) {
    console.error("❌ Lỗi tại getRecentComments:", err.message);
    throw new Error(`Error fetching recent comments: ${err.message}`);
  }
}

module.exports = {
  getCommentsByNovel,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  getRecentComments,
};