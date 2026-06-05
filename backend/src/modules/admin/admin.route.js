const express = require('express');// Express router cho các route quản trị viên
const router = express.Router(); // Đảm bảo rằng tất cả các route trong router này đều yêu cầu xác thực và quyền admin
const controller = require('./admin.controller'); // Controller chứa logic xử lý cho các route quản trị viên
const authRequired = require('../../middlewares/authRequired');
const adminRequired = require('../../middlewares/adminRequired');

// All admin routes require auth + admin role
router.use(authRequired, adminRequired); // Middleware bảo vệ tất cả các route bên dưới, chỉ cho phép admin truy cập

// 📊 Dashboard
router.get('/dashboard/stats', controller.getDashboardStats); // Lấy thống kê tổng quan cho dashboard admin

// 📚 Novels
router.get('/novels/pending', controller.getPendingNovels); // Lấy danh sách tiểu thuyết đang chờ duyệt với phân trang
router.get('/novels', controller.getAllNovels); // Lấy danh sách tất cả tiểu thuyết với phân trang
router.put('/novels/:id/approve', controller.approveNovel); // Duyệt một tiểu thuyết - chỉ dành cho admin
router.put('/novels/:id/reject', controller.rejectNovel); // Từ chối một tiểu thuyết - chỉ dành cho admin
router.delete('/novels/:id', controller.deleteNovelAsAdmin); // Xóa một tiểu thuyết - chỉ dành cho admin

// 👥 Users
router.get('/users', controller.getAllUsers); // Lấy danh sách tất cả người dùng
router.patch('/users/:id/toggle-active', controller.toggleUserActive); // Bật/tắt hoạt động của người dùng
router.delete('/users/:id', controller.deleteUser); // Xóa một người dùng - chỉ dành cho admin
router.patch('/users/:id/lock', controller.lockUser); // Khóa tài khoản người dùng - chỉ dành cho admin
router.patch('/users/:id/unlock', controller.unlockUser); // Mở khóa tài khoản người dùng - chỉ dành cho admin
router.patch('/users/:id/role', controller.changeUserRole); // Thay đổi vai trò của người dùng - chỉ dành cho admin

// 💬 Comments
router.get('/comments/pending', controller.getCommentsForModeration); // Lấy danh sách bình luận đang chờ duyệt với phân trang
router.put('/comments/:id/approve', controller.approveComment); // Duyệt một bình luận - chỉ dành cho admin
router.delete('/comments/:id', controller.rejectComment); // Từ chối một bình luận - chỉ dành cho admin

// 🏷️ Genres
router.get('/genres', controller.getAllGenres); // Lấy danh sách tất cả thể loại
router.post('/genres', controller.createGenre); // Tạo một thể loại mới - chỉ dành cho admin
router.put('/genres/:id', controller.updateGenre); // Cập nhật một thể loại - chỉ dành cho admin
router.delete('/genres/:id', controller.deleteGenre); // Xóa một thể loại - chỉ dành cho admin

// 📋 Reports
router.get('/reports', controller.getReports); // Lấy danh sách tất cả báo cáo
router.get('/reports/:id', controller.getReportDetail); // Lấy chi tiết một báo cáo
router.patch('/reports/:id', controller.resolveReport); // Xử lý một báo cáo

// 📢 Announcements
router.get('/announcements', controller.getAnnouncements); // Lấy danh sách thông báo
router.post('/announcements', controller.createAnnouncement); // Tạo một thông báo mới - chỉ dành cho admin
router.delete('/announcements/:id', controller.deleteAnnouncement); // Xóa một thông báo - chỉ dành cho admin

// 🚫 Banned Words
router.get('/banned-words', controller.getBannedWords); // Lấy danh sách từ cấm

// 💬 Forum Posts Management
router.get('/forum/posts', controller.getAllForumPosts); // Lấy danh sách bài viết diễn đàn với phân trang
router.get('/forum/posts/:id/comments', controller.getForumPostComments); // Lấy danh sách bình luận của một bài viết diễn đàn
router.delete('/forum/posts/:id', controller.deleteForumPost); // Xóa một bài viết diễn đàn - chỉ dành cho admin

// 📖 Novel Publish Management
router.get('/publish', controller.getAllPublishedNovels); // Lấy danh sách tiểu thuyết đã xuất bản với phân trang
router.delete('/publish/:id', controller.deletePublishedNovel); // Xóa một tiểu thuyết đã xuất bản - chỉ dành cho admin

module.exports = router;