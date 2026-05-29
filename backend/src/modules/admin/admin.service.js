const pool = require("../../config/db");

/* ==================== DASHBOARD STATS ==================== */
async function getDashboardStats() {
  try {
    const [[novelCount]] = await pool.query("SELECT COUNT(*) as count FROM QLTT");
    const [[userCount]] = await pool.query("SELECT COUNT(*) as count FROM users");
    const [[commentCount]] = await pool.query("SELECT COUNT(*) as count FROM comments");
    const [[reportCount]] = await pool.query("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'");

    return {
      novels: novelCount?.count || 0,
      users: userCount?.count || 0,
      comments: commentCount?.count || 0,
      pendingReports: reportCount?.count || 0,
    };
  } catch (err) {
    console.error("❌ Error getDashboardStats:", err.message);
    throw err;
  }
}

/* ==================== NOVELS MANAGEMENT ==================== */
async function getPendingNovels() {
  try {
    const [novels] = await pool.query(`
      SELECT q.idln, q.title, q.author, q.authordraw, q.cover, 
             q.description, q.created_by, q.created_at, u.username as creator
      FROM QLTT q
      LEFT JOIN users u ON q.created_by = u.user_id
      WHERE q.active = 0
      ORDER BY q.created_at DESC
    `);
    return novels;
  } catch (err) {
    console.error("❌ Error getPendingNovels:", err.message);
    throw err;
  }
}

async function approveNovel(id) {
  try {
    const [result] = await pool.query("UPDATE QLTT SET active = 1 WHERE idln = ?", [id]);
    return { success: true, message: "Novel approved" };
  } catch (err) {
    console.error("❌ Error approveNovel:", err.message);
    throw err;
  }
}

async function rejectNovel(id) {
  try {
    // Xóa hoàn toàn truyện khi từ chối (không chỉ set active = 0)
    await pool.query("SET FOREIGN_KEY_CHECKS=0");
    
    await pool.query("DELETE FROM chapters WHERE idln = ?", [id]);
    await pool.query("DELETE FROM volumes WHERE idln = ?", [id]);
    await pool.query("DELETE FROM comments WHERE idln = ?", [id]);
    await pool.query("DELETE FROM ratings WHERE idln = ?", [id]);
    await pool.query("DELETE FROM reading_history WHERE idln = ?", [id]);
    await pool.query("DELETE FROM truyen_theloai WHERE idln = ?", [id]);
    const [result] = await pool.query("DELETE FROM QLTT WHERE idln = ?", [id]);
    
    await pool.query("SET FOREIGN_KEY_CHECKS=1");
    
    return { success: true, message: "Novel rejected and deleted" };
  } catch (err) {
    await pool.query("SET FOREIGN_KEY_CHECKS=1");
    console.error("❌ Error rejectNovel:", err.message);
    throw err;
  }
}

async function deleteNovelAsAdmin(id) {
  try {
    // Disable foreign keys, delete like in novel deletion
    await pool.query("SET FOREIGN_KEY_CHECKS=0");
    
    await pool.query("DELETE FROM chapters WHERE idln = ?", [id]);
    await pool.query("DELETE FROM volumes WHERE idln = ?", [id]);
    await pool.query("DELETE FROM comments WHERE idln = ?", [id]);
    await pool.query("DELETE FROM ratings WHERE idln = ?", [id]);
    await pool.query("DELETE FROM reading_history WHERE idln = ?", [id]);
    await pool.query("DELETE FROM truyen_theloai WHERE idln = ?", [id]);
    const [result] = await pool.query("DELETE FROM QLTT WHERE idln = ?", [id]);
    
    await pool.query("SET FOREIGN_KEY_CHECKS=1");
    
    return { success: true, message: "Novel deleted" };
  } catch (err) {
    await pool.query("SET FOREIGN_KEY_CHECKS=1");
    console.error("❌ Error deleteNovelAsAdmin:", err.message);
    throw err;
  }
}

/* ==================== USERS MANAGEMENT ==================== */
async function getAllUsers(limit = 20, offset = 0) {
  try {
    const [users] = await pool.query(`
      SELECT user_id, username, email, role, active, created_at 
      FROM users 
      ORDER BY user_id DESC 
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    const [[count]] = await pool.query("SELECT COUNT(*) as total FROM users");
    
    return { users, total: count?.total || 0 };
  } catch (err) {
    console.error("❌ Error getAllUsers:", err.message);
    throw err;
  }
}

async function toggleUserActive(userId) {
  try {
    // Get current active status
    const [[user]] = await pool.query("SELECT active FROM users WHERE user_id = ?", [userId]);
    
    if (!user) throw new Error("User not found");
    
    const newStatus = user.active ? 0 : 1;
    await pool.query("UPDATE users SET active = ? WHERE user_id = ?", [newStatus, userId]);
    
    return { success: true, active: newStatus };
  } catch (err) {
    console.error("❌ Error toggleUserActive:", err.message);
    throw err;
  }
}

async function deleteUser(userId) {
  try {
    // Xóa user và tất cả dữ liệu liên quan
    await pool.query("SET FOREIGN_KEY_CHECKS=0");
    
    // Xóa comments của user
    await pool.query("DELETE FROM comments WHERE user_id = ?", [userId]);
    
    // Xóa ratings của user
    await pool.query("DELETE FROM ratings WHERE user_id = ?", [userId]);
    
    // Xóa reading history của user
    await pool.query("DELETE FROM reading_history WHERE user_id = ?", [userId]);
    
    // Xóa forum posts của user
    await pool.query("DELETE FROM forum_posts WHERE user_id = ?", [userId]);
    
    // Xóa forum comments của user
    await pool.query("DELETE FROM forum_comments WHERE user_id = ?", [userId]);
    
    // Xóa comment likes của user
    await pool.query("DELETE FROM comment_likes WHERE user_id = ?", [userId]);
    
    // Xóa forum comment likes của user
    await pool.query("DELETE FROM forum_comment_likes WHERE user_id = ?", [userId]);
    
    // Cuối cùng xóa user
    const [result] = await pool.query("DELETE FROM users WHERE user_id = ?", [userId]);
    
    await pool.query("SET FOREIGN_KEY_CHECKS=1");
    
    return { success: true, message: "User deleted successfully" };
  } catch (err) {
    await pool.query("SET FOREIGN_KEY_CHECKS=1");
    console.error("❌ Error deleteUser:", err.message);
    throw err;
  }
}

async function lockUser(userId) {
  try {
    const [[user]] = await pool.query("SELECT active FROM users WHERE user_id = ?", [userId]);
    
    if (!user) throw new Error("User not found");
    
    await pool.query("UPDATE users SET active = 0 WHERE user_id = ?", [userId]);
    
    return { success: true, message: "User account locked successfully", active: 0 };
  } catch (err) {
    console.error("❌ Error lockUser:", err.message);
    throw err;
  }
}

async function unlockUser(userId) {
  try {
    const [[user]] = await pool.query("SELECT active FROM users WHERE user_id = ?", [userId]);
    
    if (!user) throw new Error("User not found");
    
    await pool.query("UPDATE users SET active = 1 WHERE user_id = ?", [userId]);
    
    return { success: true, message: "User account unlocked successfully", active: 1 };
  } catch (err) {
    console.error("❌ Error unlockUser:", err.message);
    throw err;
  }
}

async function changeUserRole(userId, newRole) {
  try {
    await pool.query("UPDATE users SET role = ? WHERE user_id = ?", [newRole, userId]);
    return { success: true, message: `Role changed to ${newRole}` };
  } catch (err) {
    console.error("❌ Error changeUserRole:", err.message);
    throw err;
  }
}

/* ==================== COMMENTS MODERATION ==================== */
async function getCommentsForModeration(limit = 20, offset = 0) {
  try {
    const [comments] = await pool.query(`
      SELECT c.comment_id, c.content, c.status, c.created_at, 
             u.username, q.title as novel_title
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN QLTT q ON c.idln = q.idln
      WHERE c.status IN ('Spam', 'Ẩn')
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    return comments;
  } catch (err) {
    console.error("❌ Error getCommentsForModeration:", err.message);
    throw err;
  }
}

async function approveComment(commentId) {
  try {
    await pool.query("UPDATE comments SET status = 'Hiện' WHERE comment_id = ?", [commentId]);
    return { success: true, message: "Comment approved" };
  } catch (err) {
    console.error("❌ Error approveComment:", err.message);
    throw err;
  }
}

async function rejectComment(commentId) {
  try {
    await pool.query("DELETE FROM comments WHERE comment_id = ?", [commentId]);
    return { success: true, message: "Comment deleted" };
  } catch (err) {
    console.error("❌ Error rejectComment:", err.message);
    throw err;
  }
}

/* ==================== GENRE MANAGEMENT ==================== */
async function getAllGenres() {
  try {
    const [genres] = await pool.query("SELECT id_tl, ten_tl, slug FROM theloai ORDER BY id_tl");
    return genres;
  } catch (err) {
    console.error("❌ Error getAllGenres:", err.message);
    throw err;
  }
}

async function createGenre(ten_tl, slug) {
  try {
    const genreSlug = slug || ten_tl.toLowerCase().replace(/\s+/g, '-');
    const [result] = await pool.query(
      "INSERT INTO theloai (ten_tl, slug) VALUES (?, ?)",
      [ten_tl, genreSlug]
    );
    return { id_tl: result.insertId, ten_tl, slug: genreSlug };
  } catch (err) {
    console.error("❌ Error createGenre:", err.message);
    throw err;
  }
}

async function updateGenre(genreId, ten_tl, slug) {
  try {
    const genreSlug = slug || ten_tl.toLowerCase().replace(/\s+/g, '-');
    await pool.query(
      "UPDATE theloai SET ten_tl = ?, slug = ? WHERE id_tl = ?",
      [ten_tl, genreSlug, genreId]
    );
    return { id_tl: genreId, ten_tl, slug: genreSlug, success: true };
  } catch (err) {
    console.error("❌ Error updateGenre:", err.message);
    throw err;
  }
}

async function deleteGenre(genreId) {
  try {
    // Remove from truyen_theloai first
    await pool.query("DELETE FROM truyen_theloai WHERE id_tl = ?", [genreId]);
    await pool.query("DELETE FROM theloai WHERE id_tl = ?", [genreId]);
    return { success: true, message: "Genre deleted" };
  } catch (err) {
    console.error("❌ Error deleteGenre:", err.message);
    throw err;
  }
}

/* ==================== REPORTS MANAGEMENT ==================== */
async function getReports(limit = 20, offset = 0) {
  try {
    const [reports] = await pool.query(`
      SELECT r.id, r.reported_by, r.reported_item_id, r.report_type, 
             r.reason, r.status, r.created_at, u.username
      FROM reports r
      LEFT JOIN users u ON r.reported_by = u.user_id
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    return reports;
  } catch (err) {
    console.error("❌ Error getReports:", err.message);
    throw err;
  }
}

async function resolveReport(reportId, status, notes) {
  try {
    await pool.query(
      "UPDATE reports SET status = ?, notes = ?, resolved_at = NOW() WHERE id = ?",
      [status, notes, reportId]
    );
    return { success: true, message: "Report resolved" };
  } catch (err) {
    console.error("❌ Error resolveReport:", err.message);
    throw err;
  }
}

/* ==================== ANNOUNCEMENTS ==================== */
async function getAnnouncements() {
  try {
    const [announcements] = await pool.query(`
      SELECT fp.post_id, fp.title, fp.content, fp.created_at, u.username
      FROM forum_posts fp
      LEFT JOIN users u ON fp.user_id = u.user_id
      WHERE fp.category = 'announcement' OR fp.category = 'thong-bao'
      ORDER BY fp.created_at DESC
      LIMIT 10
    `);
    
    return announcements;
  } catch (err) {
    console.error("❌ Error getAnnouncements:", err.message);
    throw err;
  }
}

async function createAnnouncement(title, content, userId) {
  try {
    const [result] = await pool.query(
      `INSERT INTO forum_posts (user_id, title, content, category, created_at)
       VALUES (?, ?, ?, 'thong-bao', NOW())`,
      [userId, title, content]
    );
    
    return { post_id: result.insertId, title, content };
  } catch (err) {
    console.error("❌ Error createAnnouncement:", err.message);
    throw err;
  }
}

async function deleteAnnouncement(announcementId) {
  try {
    await pool.query("DELETE FROM forum_posts WHERE post_id = ?", [announcementId]);
    return { success: true, message: "Announcement deleted" };
  } catch (err) {
    console.error("❌ Error deleteAnnouncement:", err.message);
    throw err;
  }
}

module.exports = {
  getDashboardStats,
  getPendingNovels,
  approveNovel,
  rejectNovel,
  deleteNovelAsAdmin,
  getAllUsers,
  toggleUserActive,
  deleteUser,
  changeUserRole,
  getCommentsForModeration,
  approveComment,
  rejectComment,
  getAllGenres,
  createGenre,
  updateGenre,
  deleteGenre,
  getReports,
  resolveReport,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
};
