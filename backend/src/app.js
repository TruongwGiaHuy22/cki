const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const { corsOrigin } = require("./config/env");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const db = require("./config/db");

const app = express();

// CORS config - phải trước helmet
const corsOptions = {
  origin: corsOrigin,
  credentials: true
};
app.use(cors(corsOptions));

// Helmet với config cho phép static files
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(morgan("dev"));

// Serve static files từ thư mục uploads - PHẢI ĐẶT ĐẦU TIÊN
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Auto-initialize required tables
const initializeTables = async () => {
  try {
    // Create forum_comment_likes table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS forum_comment_likes (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        comment_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_forum_like (comment_id, user_id),
        FOREIGN KEY (comment_id) REFERENCES forum_comments(comment_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);
    console.log("✅ forum_comment_likes table initialized");
  } catch (err) {
    console.warn("⚠️ Could not initialize forum_comment_likes:", err.message);
  }

  try {
    // Create ratings table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        rating_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT UNSIGNED NOT NULL,
        idln INT NOT NULL,
        rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5),
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_rating (user_id, idln),
        FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY(idln) REFERENCES QLTT(idln) ON DELETE CASCADE
      )
    `);
    console.log("✅ ratings table initialized");
  } catch (err) {
    console.warn("⚠️ Could not initialize ratings:", err.message);
  }
};

// Initialize tables on app start
initializeTables();

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Backend is running" });
});

app.use("/api", routes);
app.use(errorHandler);

module.exports = app;