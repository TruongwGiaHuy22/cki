const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../config/env");

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("🔐 authRequired - Auth header:", authHeader ? "Present" : "Missing");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No Bearer token found");
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, jwtConfig.secret);
    console.log("✅ Token verified. Payload:", payload);
    req.user = payload;
    return next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

module.exports = authRequired;
