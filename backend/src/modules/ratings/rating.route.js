const express = require("express");
const controller = require("./rating.controller");
const authRequired = require("../../middlewares/authRequired");

const router = express.Router();

// Get average rating for a novel
router.get("/:idln/average", controller.getAverage);

// Get all ratings for a novel
router.get("/:idln/all", controller.getAllRatings);

// Get my rating for a novel (requires auth)
router.get("/:idln/my", authRequired, controller.getMyRating);

// Submit or update rating (requires auth)
router.post("/:idln", authRequired, controller.submitRating);

// Delete my rating (requires auth)
router.delete("/:idln", authRequired, controller.deleteMyRating);

module.exports = router;
