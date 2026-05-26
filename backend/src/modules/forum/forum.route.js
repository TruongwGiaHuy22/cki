const express = require('express');
const router = express.Router();
const forumController = require('./forum.controller');
const verifyToken = require('../../middlewares/authRequired');
const optionalAuth = require('../../middlewares/optionalAuth');

// Ai cũng có thể xem bài viết và bình luận (Không bảo mật bằng verifyToken)
router.get('/posts', forumController.getAllPosts);
router.get('/posts/:id', forumController.getPostById);
router.get('/posts/:id/comments', optionalAuth, forumController.getComments);

// Chỉ những người đã đăng nhập mới được tạo bài viết và bình luận (Cần middleware)
router.post('/posts', verifyToken, forumController.createPost);
router.put('/posts/:id', verifyToken, forumController.updatePost);
router.delete('/posts/:id', verifyToken, forumController.deletePost);
router.post('/comments', verifyToken, forumController.createComment);
router.delete('/comments/:id', verifyToken, forumController.deleteComment);
router.post('/comments/:id/like', verifyToken, forumController.likeComment);

// Bổ sung API giả lập để đồng bộ hóa các tài nguyên cũ mà không lỗi hệ thống
router.get('/novels-lookup', (req, res) => res.json({ success: true, data: [] }));

module.exports = router;