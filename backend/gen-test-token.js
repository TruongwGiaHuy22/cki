const jwt = require("jsonwebtoken");

// Tạo token giả cho user ID 6 (giahuy)
const token = jwt.sign(
  { sub: 6, email: "giahuy@example.com" },
  "your-secret-key", // Thay bằng secret key thực từ .env
  { expiresIn: "7d" }
);

console.log("Test Token for giahuy (user_id=6):");
console.log(token);
console.log("\n");
console.log("Decoded payload:");
console.log(jwt.decode(token));
