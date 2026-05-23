const { z } = require("zod");

const createNovelSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).optional(),
  cover: z.string().max(500).optional().default(""),
  banner: z.string().max(500).optional().default(""),
  author: z.string().min(1).max(255),
  authordraw: z.string().max(255).optional().default(""),
  description: z.string().min(1).max(50000),
  type: z.enum(["Truyện dịch", "Sáng tác", "AI dịch"]).default("Truyện dịch"),
  statuss: z.enum(["Đang tiến hành", "Hoàn thành", "Tạm ngưng"]).default("Đang tiến hành"),
  age_limit: z.coerce.number().int().min(0).max(21).default(0),
  genres: z.array(z.string()).optional().default([]),
});

const updateNovelSchema = createNovelSchema.partial();

module.exports = { createNovelSchema, updateNovelSchema };
