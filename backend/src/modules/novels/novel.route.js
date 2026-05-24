const express = require("express");
const controller = require("./novel.controller");
const authRequired = require("../../middlewares/authRequired");

const router = express.Router();

router.get("/search", controller.search);
router.get("/", controller.list);
router.get("/my", authRequired, controller.listByUser);
router.get("/:id", controller.detail);
router.get("/:id/chapters", controller.chapters);
router.post("/:id/volumes", authRequired, controller.createVolume);
router.post("/:id/chapters", authRequired, controller.createChapter);
router.post("/", authRequired, controller.create);
router.put("/:id", authRequired, controller.update);
router.delete("/:id", authRequired, controller.remove);
router.delete("/volume/:volumeId", authRequired, controller.deleteVolume);
router.delete("/chapter/:chapterId", authRequired, controller.deleteChapter);

module.exports = router;
