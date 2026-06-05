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

async function resetPassword(req, res, next) {
  try {
    const { username, email, oldPassword, newPassword } = req.body;
    if (!username || !email || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin"
      });
    }
    const result = await authService.resetPassword(username, email, oldPassword, newPassword);
    res.json({ success: true, message: "Đổi mật khẩu thành công", data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, resetPassword };