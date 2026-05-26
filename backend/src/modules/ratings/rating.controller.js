const { createRatingSchema, updateRatingSchema } = require("./rating.validator");
const service = require("./rating.service");

/* =======================
   GET MY RATING FOR A NOVEL
======================= */
async function getMyRating(req, res, next) {
  try {
    const userId = Number(req.user?.sub);
    const idln = Number(req.params.idln);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ success: false, message: "User ID not found" });
    }
    if (isNaN(idln) || idln <= 0) {
      return res.status(400).json({ success: false, message: "Invalid novel ID" });
    }

    const rating = await service.getRatingByUser(userId, idln);
    res.json({ success: true, data: rating });
  } catch (err) {
    next(err);
  }
}

/* =======================
   GET AVERAGE RATING FOR NOVEL
======================= */
async function getAverage(req, res, next) {
  try {
    const idln = Number(req.params.idln);

    if (isNaN(idln) || idln <= 0) {
      return res.status(400).json({ success: false, message: "Invalid novel ID" });
    }

    const avgRating = await service.getAverageRating(idln);
    res.json({ success: true, data: avgRating });
  } catch (err) {
    next(err);
  }
}

/* =======================
   CREATE OR UPDATE RATING
======================= */
async function submitRating(req, res, next) {
  try {
    const userId = Number(req.user?.sub);
    const idln = Number(req.params.idln);
    const payload = createRatingSchema.parse(req.body);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ success: false, message: "User ID not found" });
    }
    if (isNaN(idln) || idln <= 0) {
      return res.status(400).json({ success: false, message: "Invalid novel ID" });
    }

    // Check if user already has a rating
    const existingRating = await service.getRatingByUser(userId, idln);

    if (existingRating) {
      // Update existing rating
      await service.updateRating(existingRating.rating_id, payload.rating, payload.review || null);
      const updatedRating = await service.getRatingByUser(userId, idln);
      return res.json({ success: true, message: "Rating updated", data: updatedRating });
    }

    // Create new rating
    const ratingId = await service.createRating(userId, idln, payload.rating, payload.review || null);
    const newRating = await service.getRatingByUser(userId, idln);
    res.json({ success: true, message: "Rating submitted", data: newRating });
  } catch (err) {
    next(err);
  }
}

/* =======================
   DELETE MY RATING
======================= */
async function deleteMyRating(req, res, next) {
  try {
    const userId = Number(req.user?.sub);
    const idln = Number(req.params.idln);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ success: false, message: "User ID not found" });
    }
    if (isNaN(idln) || idln <= 0) {
      return res.status(400).json({ success: false, message: "Invalid novel ID" });
    }

    const rating = await service.getRatingByUser(userId, idln);
    if (!rating) {
      return res.status(404).json({ success: false, message: "Rating not found" });
    }

    await service.deleteRating(rating.rating_id);
    res.json({ success: true, message: "Rating deleted" });
  } catch (err) {
    next(err);
  }
}

/* =======================
   GET ALL RATINGS FOR NOVEL
======================= */
async function getAllRatings(req, res, next) {
  try {
    const idln = Number(req.params.idln);

    if (isNaN(idln) || idln <= 0) {
      return res.status(400).json({ success: false, message: "Invalid novel ID" });
    }

    const ratings = await service.getAllRatings(idln);
    res.json({ success: true, data: ratings });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyRating,
  getAverage,
  submitRating,
  deleteMyRating,
  getAllRatings,
};
