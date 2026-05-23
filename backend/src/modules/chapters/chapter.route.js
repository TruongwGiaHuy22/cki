const express = require("express");
const controller = require("./chapter.controller");
const router = express.Router();

router.get("/:id", controller.detail);

module.exports = router;
