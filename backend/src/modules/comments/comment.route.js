const express = require("express");
const controller = require("./comment.controller");
const authRequired = require("../../middlewares/authRequired");
const optionalAuth = require("../../middlewares/optionalAuth");

const router = express.Router();

// GET comments của một truyện (optionalAuth - cho phép xác định người dùng nếu đã đăng nhập)
router.get("/novel/:idln", optionalAuth, controller.getCommentsByNovel);

// POST comment mới (yêu cầu auth)
router.post("/", authRequired, controller.createComment);

// PUT update comment (yêu cầu auth)
router.put("/:id", authRequired, controller.updateComment);

// DELETE comment (yêu cầu auth)
router.delete("/:id", authRequired, controller.deleteComment);

// POST like comment (yêu cầu auth)
router.post("/:id/like", authRequired, controller.likeComment);

module.exports = router;
