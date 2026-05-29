const express = require('express');
const router = express.Router();
const controller = require('./adminController');
const authRequired = require('../../middlewares/authRequired');
const adminRequired = require('../../middlewares/adminRequired');

// All admin routes require auth + admin role
router.use(authRequired, adminRequired);

// 📊 Dashboard
router.get('/dashboard/stats', controller.getDashboardStats);

// 📚 Novels
router.get('/novels/pending', controller.getPendingNovels);
router.put('/novels/:id/approve', controller.approveNovel);
router.put('/novels/:id/reject', controller.rejectNovel);
router.delete('/novels/:id', controller.deleteNovelAsAdmin);

// 👥 Users
router.get('/users', controller.getAllUsers);
router.patch('/users/:id/toggle-active', controller.toggleUserActive);
router.delete('/users/:id', controller.deleteUser);
router.patch('/users/:id/lock', controller.lockUser);
router.patch('/users/:id/unlock', controller.unlockUser);
router.patch('/users/:id/role', controller.changeUserRole);

// 💬 Comments
router.get('/comments/pending', controller.getCommentsForModeration);
router.put('/comments/:id/approve', controller.approveComment);
router.delete('/comments/:id', controller.rejectComment);

// 🏷️ Genres
router.get('/genres', controller.getAllGenres);
router.post('/genres', controller.createGenre);
router.put('/genres/:id', controller.updateGenre);
router.delete('/genres/:id', controller.deleteGenre);

// 📋 Reports
router.get('/reports', controller.getReports);
router.patch('/reports/:id', controller.resolveReport);

// 📢 Announcements
router.get('/announcements', controller.getAnnouncements);
router.post('/announcements', controller.createAnnouncement);
router.delete('/announcements/:id', controller.deleteAnnouncement);

// 🚫 Banned Words
router.get('/banned-words', controller.getBannedWords);

module.exports = router;
