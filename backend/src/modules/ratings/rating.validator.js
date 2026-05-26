const { z } = require("zod");

const createRatingSchema = z.object({
  rating: z.number().int().min(1).max(5).describe("Rating from 1 to 5"),
  review: z.string().optional().nullable(),
});

const updateRatingSchema = z.object({
  rating: z.number().int().min(1).max(5).describe("Rating from 1 to 5"),
  review: z.string().optional().nullable(),
});

module.exports = {
  createRatingSchema,
  updateRatingSchema,
};
