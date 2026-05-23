const express = require("express");
const controller = require("./novel.controller");
const authRequired = require("../../middlewares/authRequired");

const router = express.Router();


router.get("/", controller.list);
router.get("/:id", controller.detail);
router.get("/:id/chapters", controller.chapters);
router.post("/:id/volumes", authRequired, controller.createVolume);
router.post("/:id/chapters", authRequired, controller.createChapter);
router.post("/", authRequired, controller.create);
router.put("/:id", authRequired, controller.update);
router.delete("/:id", authRequired, controller.remove);

module.exports = router;
