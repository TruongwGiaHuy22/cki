const service = require("./admin.service");
const { BANNED_WORDS } = require("../../config/bannedWords");

// 📊 DASHBOARD STATS
async function getDashboardStats(req, res, next) {
  try {
    const stats = await service.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

// 📚 NOVELS MANAGEMENT
async function getPendingNovels(req, res, next) {
  try {
    const novels = await service.getPendingNovels();
    res.json({ success: true, data: novels });
  } catch (err) {
    next(err);
  }
}

async function getAllNovels(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    const result = await service.getAllNovels(limit, offset);
    res.json({ success: true, data: result.novels, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function approveNovel(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await service.approveNovel(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function rejectNovel(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await service.rejectNovel(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function deleteNovelAsAdmin(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await service.deleteNovelAsAdmin(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// 👥 USERS MANAGEMENT
async function getAllUsers(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const users = await service.getAllUsers(limit, offset);
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

async function toggleUserActive(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await service.toggleUserActive(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await service.deleteUser(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function lockUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await service.lockUser(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function unlockUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await service.unlockUser(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function changeUserRole(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { role } = req.body;
    
    console.log(`🔄 Change role request - User ID: ${id}, Role received: "${role}"`);
    
    // Map English role names to Vietnamese database role names
    const roleMapping = {
      'user': 'docgia',
      'author': 'tacgia',
      'moderator': 'nhanvien',
      'admin': 'admin'
    };
    
    if (!Object.keys(roleMapping).includes(role)) {
      console.log(`❌ Invalid role: "${role}". Allowed roles: ${Object.keys(roleMapping).join(', ')}`);
      return res.status(400).json({ success: false, message: "Invalid role: " + role });
    }
    
    const dbRole = roleMapping[role];
    console.log(`✅ Converting "${role}" to database role "${dbRole}"`);
    
    const result = await service.changeUserRole(id, dbRole);
    console.log(`✅ Role changed successfully`);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(`❌ Error changing role:`, err.message);
    next(err);
  }
}

// 💬 COMMENTS MODERATION
async function getCommentsForModeration(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const comments = await service.getCommentsForModeration(limit, offset);
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
}

async function approveComment(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await service.approveComment(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function rejectComment(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await service.rejectComment(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// 🏷️ GENRE MANAGEMENT
async function getAllGenres(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const result = await service.getAllGenres(limit, offset);
    res.json({ success: true, data: result.genres, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function createGenre(req, res, next) {
  try {
    const { ten_tl, slug } = req.body;
    if (!ten_tl) return res.status(400).json({ success: false, message: "Genre name required" });
    const result = await service.createGenre(ten_tl, slug);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function updateGenre(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { ten_tl, slug } = req.body;
    if (!ten_tl) return res.status(400).json({ success: false, message: "Genre name required" });
    const result = await service.updateGenre(id, ten_tl, slug);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function deleteGenre(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await service.deleteGenre(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// 📋 REPORTS MANAGEMENT
async function getReports(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const reports = await service.getReports(limit, offset);
    res.json({ success: true, data: reports });
  } catch (err) {
    next(err);
  }
}

async function resolveReport(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { status, notes } = req.body;
    const result = await service.resolveReport(id, status, notes);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

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

// 📢 ANNOUNCEMENTS
async function getAnnouncements(req, res, next) {
  try {
    const announcements = await service.getAnnouncements();
    res.json({ success: true, data: announcements });
  } catch (err) {
    next(err);
  }
}

async function createAnnouncement(req, res, next) {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content required" });
    }
    const result = await service.createAnnouncement(title, content, req.user.sub);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function deleteAnnouncement(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await service.deleteAnnouncement(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// 🚫 BANNED WORDS MANAGEMENT
async function getBannedWords(req, res, next) {
  try {
    res.json({ success: true, data: BANNED_WORDS, total: BANNED_WORDS.length });
  } catch (err) {
    next(err);
  }
}

// 💬 FORUM POSTS MANAGEMENT
async function getAllForumPosts(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const result = await service.getAllForumPosts(limit, offset);
    res.json({ success: true, data: result.posts, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function deleteForumPost(req, res, next) {
  try {
    const postId = Number(req.params.id);
    const result = await service.deleteForumPost(postId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function getForumPostComments(req, res, next) {
  try {
    const postId = Number(req.params.id);
    const comments = await service.getForumPostComments(postId);
    res.json({ success: true, data: comments || [] });
  } catch (err) {
    next(err);
  }
}

// 📖 NOVEL PUBLISH MANAGEMENT
async function getAllPublishedNovels(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const result = await service.getAllPublishedNovels(limit, offset);
    res.json({ success: true, data: result.publishes, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function deletePublishedNovel(req, res, next) {
  try {
    const publishId = Number(req.params.id);
    const result = await service.deletePublishedNovel(publishId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardStats,
  getPendingNovels,
  getAllNovels,
  approveNovel,
  rejectNovel,
  deleteNovelAsAdmin,
  getAllUsers,
  toggleUserActive,
  deleteUser,
  lockUser,
  unlockUser,
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
  getReportDetail,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getBannedWords,
  getAllForumPosts,
  deleteForumPost,
  getForumPostComments,
  getAllPublishedNovels,
  deletePublishedNovel,
};