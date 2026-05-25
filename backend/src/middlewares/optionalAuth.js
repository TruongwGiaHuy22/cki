const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../config/env");

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No token, but that's okay - continue without user
    return next();
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, jwtConfig.secret);
    req.user = payload;
  } catch (err) {
    // Token invalid, but that's okay - continue without user
    console.log("⚠️ optionalAuth - Token verification failed (non-blocking):", err.message);
  }
  
  return next();
}

module.exports = optionalAuth;
