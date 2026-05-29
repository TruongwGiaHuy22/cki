const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

  const passwordHash = await bcrypt.hash(password, 10);
  
  // 2. Đổi 'userpass' thành 'userpassword' cho đúng với DB
  const [result] = await pool.query(
    "INSERT INTO users (username, email, userpassword) VALUES (?, ?, ?)",
    [username, email, passwordHash]
  );

  return { id: result.insertId, username, email };
}

async function login(data) {
  const { identifier, password } = data;
  
  // 3. Đổi 'id' thành 'user_id' và 'userpass' thành 'userpassword', thêm role
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

  // Check if account is locked
  if (!user.active) {
    const err = new Error("Tài khoản của bạn đã bị khóa");
    err.status = 403;
    throw err;
  }
  
  let ok = false;
  
  // 4. Kiểm tra mật khẩu bằng 'user.userpassword' thay vì 'user.userpass'
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

  // 5. Sử dụng 'user.user_id' để tạo mã token JWT
  const token = jwt.sign({ sub: user.user_id, email: user.email }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });

  // 6. Trả về đúng thông tin user_id kèm role
  return {
    token,
    user: { id: user.user_id, username: user.username, email: user.email, role: user.role },
  };
}

module.exports = { register, login };