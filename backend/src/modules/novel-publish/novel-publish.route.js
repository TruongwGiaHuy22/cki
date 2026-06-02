const express = require("express");
const controller = require("./novel-publish.controller");
const authRequired = require("../../middlewares/authRequired");

const router = express.Router();

router.post("/", authRequired, controller.create);
router.get("/:idln", controller.getByNovelId);
router.put("/:publish_id", authRequired, controller.update);
router.delete("/:publish_id", authRequired, controller.remove);

module.exports = router;
