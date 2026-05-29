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
    
    // Map English role names to Vietnamese database role names
    const roleMapping = {
      'user': 'docgia',
      'moderator': 'nhanvien',
      'admin': 'admin'
    };
    
    if (!Object.keys(roleMapping).includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    
    const dbRole = roleMapping[role];
    const result = await service.changeUserRole(id, dbRole);
    res.json({ success: true, data: result });
  } catch (err) {
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
    const genres = await service.getAllGenres();
    res.json({ success: true, data: genres });
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

module.exports = {
  getDashboardStats,
  getPendingNovels,
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
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getBannedWords,
};