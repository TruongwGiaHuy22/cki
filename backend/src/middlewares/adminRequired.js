const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../config/env");
const pool = require("../config/db");

async function adminRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.slice(7);
    const payload = jwt.verify(token, jwtConfig.secret);
    
    // Lấy user info từ database để check role
    const [users] = await pool.query(
      "SELECT user_id, role FROM users WHERE user_id = ?",
      [payload.sub]
    );

    if (!users.length) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const user = users[0];
    
    // Chỉ cho phép admin
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    req.user = { ...payload, role: user.role };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

module.exports = adminRequired;
