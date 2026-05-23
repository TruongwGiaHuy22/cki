const { z } = require("zod");

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

const loginSchema = z.object({
  identifier: z.string().min(3).max(255),
  password: z.string().min(1).max(128),
});

module.exports = { registerSchema, loginSchema };
