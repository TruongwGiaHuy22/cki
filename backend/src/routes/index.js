const express = require("express");
const authRoutes = require("../modules/auth/auth.route");
const novelRoutes = require("../modules/novels/novel.route");
const chapterRoutes = require("../modules/chapters/chapter.route");
const pool = require("../config/db");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/novels", novelRoutes);
router.use("/chapters", chapterRoutes);

//
// FIX: thêm API theloai trực tiếp ở đây
//
router.get("/theloai", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_tl, ten_tl, slug FROM theloai ORDER BY id_tl"
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;