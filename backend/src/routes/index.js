const express = require("express");
const authRoutes = require("../modules/auth/auth.route");
const novelRoutes = require("../modules/novels/novel.route");
const chapterRoutes = require("../modules/chapters/chapter.route");
const commentRoutes = require("../modules/comments/comment.route");
const forumRoutes = require("../modules/forum/forum.route");
const historyRoutes = require("../modules/history/history.route"); // 1. Import route mới
const pool = require("../config/db");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/novels", novelRoutes);
router.use("/chapters", chapterRoutes);
router.use("/comments", commentRoutes);
router.use("/forum", forumRoutes); 
router.use("/history", historyRoutes); // 2. Kích hoạt route

// API theloai
router.get("/theloai", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_tl, ten_tl, slug FROM theloai ORDER BY id_tl"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;