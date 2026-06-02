const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../config/env");
const pool = require("../config/db");

async function adminRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log(`❌ adminRequired: Missing or invalid auth header`);
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.slice(7);
    const payload = jwt.verify(token, jwtConfig.secret);
    console.log(`🔐 Token verified for user: ${payload.sub}`);
    
    // Lấy user info từ database để check role
    const [users] = await pool.query(
      "SELECT user_id, role FROM users WHERE user_id = ?",
      [payload.sub]
    );

    if (!users.length) {
      console.log(`❌ adminRequired: User not found - ${payload.sub}`);
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const user = users[0];
    console.log(`👤 Admin check: User ${user.user_id} has role "${user.role}"`);
    
    // Chỉ cho phép admin
    if (user.role !== 'admin') {
      console.log(`❌ adminRequired: User ${user.user_id} is not admin (role: ${user.role})`);
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    console.log(`✅ adminRequired: Admin access granted for user ${user.user_id}`);
    req.user = { ...payload, role: user.role };
    return next();
  } catch (err) {
    console.log(`❌ adminRequired: Token error - ${err.message}`);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

module.exports = adminRequired;
