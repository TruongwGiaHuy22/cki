const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../../config/db");
const { jwt: jwtConfig } = require("../../config/env");

async function register(data) {
  const { username, email, password } = data;

  const [existing] = await pool.query(
    "SELECT id FROM dangnhap WHERE email = ? OR username = ? LIMIT 1",
    [email, username]
  );
  if (existing.length) {
    const err = new Error("Email or username already exists");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO dangnhap (username, email, userpass) VALUES (?, ?, ?)",
    [username, email, passwordHash]
  );

  return { id: result.insertId, username, email };
}

async function login(data) {
  const { identifier, password } = data;
  const [rows] = await pool.query(
    "SELECT id, username, email, userpass FROM dangnhap WHERE email = ? OR username = ? LIMIT 1",
    [identifier, identifier]
  );

  if (!rows.length) {
    const err = new Error("Bạn nhập sai mật khẩu");
    err.status = 401;
    throw err;
  }

  const user = rows[0];
  let ok = false;
  if (typeof user.userpass === "string" && user.userpass.startsWith("$2")) {
    ok = await bcrypt.compare(password, user.userpass);
  } else {
    ok = password === user.userpass;
  }
  if (!ok) {
    const err = new Error("Bạn nhập sai mật khẩu");
    err.status = 401;
    throw err;
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });

  return {
    token,
    user: { id: user.id, username: user.username, email: user.email },
  };
}

module.exports = { register, login };
