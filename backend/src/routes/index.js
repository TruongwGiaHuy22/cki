const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authRoutes = require("../modules/auth/auth.route");
const novelRoutes = require("../modules/novels/novel.route");
const chapterRoutes = require("../modules/chapters/chapter.route");
const commentRoutes = require("../modules/comments/comment.route");
const forumRoutes = require("../modules/forum/forum.route");
const historyRoutes = require("../modules/history/history.route");
const ratingRoutes = require("../modules/ratings/rating.route");
const bookmarkRoutes = require("../modules/bookmarks/bookmark.route");
const novelPublishRoutes = require("../modules/novel-publish/novel-publish.route");
const reportRoutes = require("../modules/reports/report.route");
const pool = require("../config/db");
const adminRoutes = require('../modules/admin/adminRoutes');
const authRequired = require('../middlewares/authRequired');
const adminRequired = require('../middlewares/adminRequired');

const router = express.Router();

// ===== MULTER CONFIG cho upload ảnh =====
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ cho phép upload ảnh (jpeg, jpg, png, gif, webp)"));
    }
  }
});

router.use("/auth", authRoutes);
router.use("/novels", novelRoutes);
router.use("/chapters", chapterRoutes);
router.use("/comments", commentRoutes);
router.use("/forum", forumRoutes); 
router.use("/history", historyRoutes);
router.use("/ratings", ratingRoutes);
router.use("/bookmarks", bookmarkRoutes);
router.use("/novel-publish", novelPublishRoutes);
router.use("/reports", reportRoutes);
router.use('/admin', authRequired, adminRequired, adminRoutes);

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

// ===== ROUTE UPLOAD ẢNH =====
router.post("/upload-cover", authRequired, upload.single("cover"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Không tìm thấy file ảnh" });
    }
    
    const filename = req.file.filename;
    res.json({ 
      success: true, 
      filename,
      url: `/uploads/${filename}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;