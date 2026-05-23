const { registerSchema, loginSchema } = require("./auth.validator");
const authService = require("./auth.service");

async function register(req, res, next) {
  try {
    const payload = registerSchema.parse(req.body);
    const user = await authService.register(payload);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const raw = {
      identifier: req.body.identifier || req.body.email || req.body.username,
      password: req.body.password,
    };
    const payload = loginSchema.parse(raw);
    const result = await authService.login(payload);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
