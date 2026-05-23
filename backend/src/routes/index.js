const express = require("express");
const authRoutes = require("../modules/auth/auth.route");
const novelRoutes = require("../modules/novels/novel.route");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/novels", novelRoutes);

module.exports = router;
