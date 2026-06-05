const service = require("./admin.service"); // Import service layer để xử lý logic nghiệp vụ
const { BANNED_WORDS } = require("../../config/bannedWords"); // Danh sách từ cấm có thể được lưu trong một file cấu hình riêng hoặc trong database

// 📊 DASHBOARD STATS
async function getDashboardStats(req, res, next) {
  try {
    const stats = await service.getDashboardStats(); // Lấy tất cả số liệu thống kê cần thiết trong một lần gọi
    res.json({ success: true, data: stats }); // Trả về một object chứa tất cả số liệu, ví dụ: { totalNovels, pendingNovels, totalUsers, ... }
  } catch (err) { // Bắt lỗi và trả về lỗi nếu có
    next(err); // Sử dụng next để chuyển lỗi đến middleware xử lý lỗi chung
  }
}

// 📚 NOVELS MANAGEMENT
async function getPendingNovels(req, res, next) { // Lấy danh sách truyện đang chờ duyệt
  try {
    const novels = await service.getPendingNovels(); // Gọi service để lấy danh sách truyện đang chờ duyệt
    res.json({ success: true, data: novels }); // Trả về danh sách truyện dưới dạng JSON
  } catch (err) { 
    next(err);
  }
}

async function getAllNovels(req, res, next) { // Lấy danh sách tất cả truyện với phân trang
  try {
    const limit = Number(req.query.limit) || 50; // Số lượng truyện trả về mỗi trang, mặc định là 50 nếu không có tham số limit
    const offset = Number(req.query.offset) || 0; // Vị trí bắt đầu lấy truyện, mặc định là 0 nếu không có tham số offset
    const result = await service.getAllNovels(limit, offset); // Gọi service để lấy danh sách truyện với phân trang
    res.json({ success: true, data: result.novels, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function approveNovel(req, res, next) { // Duyệt một truyện đang chờ duyệt
  try {
    const id = Number(req.params.id); // Lấy ID của truyện từ tham số URL
    const result = await service.approveNovel(id); // Gọi service để duyệt truyện, có thể bao gồm việc cập nhật trạng thái của truyện trong database
    res.json({ success: true, data: result }); // Trả về kết quả sau khi duyệt, có thể là thông tin truyện đã được duyệt hoặc chỉ là một thông báo thành công
  } catch (err) {
    next(err);
  }
}

async function rejectNovel(req, res, next) { // Từ chối một truyện đang chờ duyệt
  try {
    const id = Number(req.params.id); // Lấy ID của truyện từ tham số URL
    const result = await service.rejectNovel(id); // Gọi service để từ chối truyện
    res.json({ success: true, data: result }); // Trả về kết quả sau khi từ chối
  } catch (err) {
    next(err);
  }
}

async function deleteNovelAsAdmin(req, res, next) { // Xóa một truyện bất kỳ (dù đã duyệt hay chưa) - chỉ dành cho admin
  try {
    const id = Number(req.params.id);
    const result = await service.deleteNovelAsAdmin(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// 👥 USERS MANAGEMENT
async function getAllUsers(req, res, next) { // Lấy danh sách tất cả người dùng với phân trang
  try {
    const limit = Number(req.query.limit) || 20; // Số lượng người dùng trả về mỗi trang, mặc định là 20 nếu không có tham số limit
    const offset = Number(req.query.offset) || 0; // Vị trí bắt đầu lấy người dùng, mặc định là 0 nếu không có tham số offset
    const users = await service.getAllUsers(limit, offset); // Gọi service để lấy danh sách người dùng với phân trang
    res.json({ success: true, data: users });  // Trả về danh sách người dùng dưới dạng JSON
  } catch (err) {
    next(err);
  }
}

async function toggleUserActive(req, res, next) { // Bật/tắt trạng thái hoạt động của người dùng
  try {
    const id = Number(req.params.id); // Lấy ID của người dùng từ tham số URL
    const result = await service.toggleUserActive(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) { // Xóa một người dùng - chỉ dành cho admin
  try {
    const id = Number(req.params.id);
    const result = await service.deleteUser(id);
    res.json({ success: true, data: result }); // Trả về kết quả sau khi xóa người dùng
  } catch (err) {
    next(err);
  }
}

async function lockUser(req, res, next) { // Khóa tài khoản người dùng - chỉ dành cho admin
  try {
    const id = Number(req.params.id);
    const result = await service.lockUser(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function unlockUser(req, res, next) { // Mở khóa tài khoản người dùng - chỉ dành cho admin
  try {
    const id = Number(req.params.id);
    const result = await service.unlockUser(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function changeUserRole(req, res, next) { // Thay đổi vai trò của người dùng - chỉ dành cho admin

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
async function getCommentsForModeration(req, res, next) { // Lấy danh sách bình luận đang chờ duyệt với phân trang
  try {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const comments = await service.getCommentsForModeration(limit, offset);
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
}

async function approveComment(req, res, next) { // Duyệt một bình luận - chỉ dành cho admin
  try {
    const id = Number(req.params.id);
    const result = await service.approveComment(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function rejectComment(req, res, next) { // Từ chối một bình luận - chỉ dành cho admin
  try {
    const id = Number(req.params.id);
    const result = await service.rejectComment(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// 🏷️ GENRE MANAGEMENT
async function getAllGenres(req, res, next) { // Lấy danh sách thể loại với phân trang
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const result = await service.getAllGenres(limit, offset);
    res.json({ success: true, data: result.genres, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function createGenre(req, res, next) { // Tạo một thể loại mới - chỉ dành cho admin
  try {
    const { ten_tl, slug } = req.body;
    if (!ten_tl) return res.status(400).json({ success: false, message: "Genre name required" });
    const result = await service.createGenre(ten_tl, slug);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function updateGenre(req, res, next) { // Cập nhật thông tin thể loại - chỉ dành cho admin
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
async function getReports(req, res, next) { // Lấy danh sách báo cáo với phân trang
  try {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const reports = await service.getReports(limit, offset);
    res.json({ success: true, data: reports });
  } catch (err) {
    next(err);
  }
}

async function resolveReport(req, res, next) { // Xử lý một báo cáo - chỉ dành cho admin
  try {
    const id = Number(req.params.id);
    const { status, notes } = req.body;
    const result = await service.resolveReport(id, status, notes);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function getReportDetail(req, res, next) { // Lấy chi tiết một báo cáo - chỉ dành cho admin
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
async function getAnnouncements(req, res, next) { // Lấy danh sách thông báo với phân trang
  try {
    const announcements = await service.getAnnouncements();
    res.json({ success: true, data: announcements });
  } catch (err) {
    next(err);
  }
}

async function createAnnouncement(req, res, next) { // Tạo một thông báo mới - chỉ dành cho admin
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

async function deleteAnnouncement(req, res, next) { // Xóa một thông báo - chỉ dành cho admin
  try {
    const id = Number(req.params.id);
    const result = await service.deleteAnnouncement(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// 🚫 BANNED WORDS MANAGEMENT
async function getBannedWords(req, res, next) { // Lấy danh sách từ cấm với phân trang
  try {
    res.json({ success: true, data: BANNED_WORDS, total: BANNED_WORDS.length });
  } catch (err) {
    next(err);
  }
}

// 💬 FORUM POSTS MANAGEMENT
async function getAllForumPosts(req, res, next) { // Lấy danh sách bài viết diễn đàn với phân trang
  try {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const result = await service.getAllForumPosts(limit, offset);
    res.json({ success: true, data: result.posts, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function deleteForumPost(req, res, next) { // Xóa một bài viết diễn đàn - chỉ dành cho admin
  try {
    const postId = Number(req.params.id);
    const result = await service.deleteForumPost(postId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function getForumPostComments(req, res, next) { // Lấy danh sách bình luận của một bài viết diễn đàn

  try {
    const postId = Number(req.params.id);
    const comments = await service.getForumPostComments(postId);
    res.json({ success: true, data: comments || [] });
  } catch (err) {
    next(err);
  }
}

// 📖 NOVEL PUBLISH MANAGEMENT
async function getAllPublishedNovels(req, res, next) { // Lấy danh sách tiểu thuyết đã xuất bản với phân trang
  try {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const result = await service.getAllPublishedNovels(limit, offset);
    res.json({ success: true, data: result.publishes, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function deletePublishedNovel(req, res, next) { // Xóa một tiểu thuyết đã xuất bản - chỉ dành cho admin
  try {
    const publishId = Number(req.params.id);
    const result = await service.deletePublishedNovel(publishId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { // Export tất cả các hàm controller để sử dụng trong route
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