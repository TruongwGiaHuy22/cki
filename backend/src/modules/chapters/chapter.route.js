const express = require("express");
const controller = require("./chapter.controller");
const authRequired = require("../../middlewares/authRequired");
const router = express.Router();

router.get("/novel/:novelId", controller.listByNovel);
router.get("/:id", controller.detail);
router.put("/:id", authRequired, controller.update);

module.exports = router;
