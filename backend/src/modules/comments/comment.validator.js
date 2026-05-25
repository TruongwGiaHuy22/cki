const { z } = require("zod");

const createCommentSchema = z.object({
  content: z.string().min(1, "Nội dung bình luận không được để trống").max(5000),
  idln: z.number().int().positive("ID truyện không hợp lệ"),
  chapter_id: z.number().int().positive().optional().nullable(),
  parent_id: z.number().int().positive().optional().nullable(),
});

const updateCommentSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  status: z.enum(["Hiện", "Ẩn", "Spam"]).optional(),
});

module.exports = {
  createCommentSchema,
  updateCommentSchema,
};
