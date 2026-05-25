const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../config/env");

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, jwtConfig.secret);
    req.user = payload; // Lưu thông tin người dùng vào req
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

module.exports = authRequired;