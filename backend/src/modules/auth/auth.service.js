const bcrypt = require("bcryptjs"); // Thêm bcrypt để hash mật khẩu
const jwt = require("jsonwebtoken"); // Thêm jsonwebtoken để tạo token JWT
const pool = require("../../config/db");
const { jwt: jwtConfig } = require("../../config/env");

async function register(data) {
  const { username, email, password } = data;

  // 1. Đổi 'id' thành 'user_id' cho đúng với tên cột trong DB của bạn
  const [existing] = await pool.query(
    "SELECT user_id FROM users WHERE email = ? OR username = ? LIMIT 1",
    [email, username]
  );
  if (existing.length) {
    const err = new Error("Email or username already exists");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10); // Hash mật khẩu trước khi lưu vào DB
  
  const [result] = await pool.query(
    "INSERT INTO users (username, email, userpassword) VALUES (?, ?, ?)",
    [username, email, passwordHash]
  );

  return { id: result.insertId, username, email };
}

async function login(data) {
  const { identifier, password } = data;
  
  const [rows] = await pool.query(
    "SELECT user_id, username, email, userpassword, role, active FROM users WHERE email = ? OR username = ? LIMIT 1",
    [identifier, identifier]
  );

  if (!rows.length) {
    const err = new Error("Bạn nhập sai mật khẩu");
    err.status = 401;
    throw err;
  }

  const user = rows[0];

  if (!user.active) {
    const err = new Error("Tài khoản của bạn đã bị khóa");
    err.status = 403;
    throw err;
  }
  
  let ok = false;
  
  if (typeof user.userpassword === "string" && user.userpassword.startsWith("$2")) {
    ok = await bcrypt.compare(password, user.userpassword);
  } else {
    ok = password === user.userpassword;
  }
  
  if (!ok) {
    const err = new Error("Bạn nhập sai mật khẩu");
    err.status = 401;
    throw err;
  }

  const token = jwt.sign({ sub: user.user_id, email: user.email }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });

  return {
    token,
    user: { id: user.user_id, username: user.username, email: user.email, role: user.role },
  };
}

async function resetPassword(username, email, oldPassword, newPassword) {
  // Find user with matching username AND email
  const [rows] = await pool.query(
    "SELECT user_id, userpassword FROM users WHERE username = ? AND email = ? LIMIT 1",
    [username, email]
  );

  if (!rows.length) {
    const err = new Error("Username hoặc email không tồn tại");
    err.status = 404;
    throw err;
  }

  const user = rows[0];

  // Verify old password
  let passwordMatches = false;
  if (typeof user.userpassword === "string" && user.userpassword.startsWith("$2")) {
    passwordMatches = await bcrypt.compare(oldPassword, user.userpassword);
  } else {
    passwordMatches = oldPassword === user.userpassword;
  }

  if (!passwordMatches) {
    const err = new Error("Mật khẩu cũ không chính xác");
    err.status = 401;
    throw err;
  }

  // Hash the new password
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  // Update the password
  await pool.query(
    "UPDATE users SET userpassword = ? WHERE user_id = ?",
    [newPasswordHash, user.user_id]
  );

  return { success: true };
}

module.exports = { register, login, resetPassword };