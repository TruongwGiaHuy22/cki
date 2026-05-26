const pool = require("../../config/db");

/* =======================
   GET RATING BY USER AND NOVEL
======================= */
async function getRatingByUser(userId, idln) {
  const [rows] = await pool.query(
    "SELECT * FROM ratings WHERE user_id = ? AND idln = ?",
    [userId, idln]
  );
  return rows[0] || null;
}

/* =======================
   GET AVERAGE RATING FOR NOVEL
======================= */
async function getAverageRating(idln) {
  const [rows] = await pool.query(
    `SELECT 
      ROUND(AVG(rating), 1) as avg_rating,
      COUNT(*) as total_ratings
    FROM ratings 
    WHERE idln = ?`,
    [idln]
  );
  return rows[0] || { avg_rating: 0, total_ratings: 0 };
}

/* =======================
   CREATE RATING
======================= */
async function createRating(userId, idln, rating, review = null) {
  const [result] = await pool.query(
    "INSERT INTO ratings (user_id, idln, rating, review) VALUES (?, ?, ?, ?)",
    [userId, idln, rating, review]
  );
  return result.insertId;
}

/* =======================
   UPDATE RATING
======================= */
async function updateRating(ratingId, rating, review = null) {
  await pool.query(
    "UPDATE ratings SET rating = ?, review = ?, created_at = CURRENT_TIMESTAMP WHERE rating_id = ?",
    [rating, review, ratingId]
  );
}

/* =======================
   DELETE RATING
======================= */
async function deleteRating(ratingId) {
  await pool.query("DELETE FROM ratings WHERE rating_id = ?", [ratingId]);
}

/* =======================
   GET ALL RATINGS FOR NOVEL
======================= */
async function getAllRatings(idln) {
  const [rows] = await pool.query(
    `SELECT r.*, u.username FROM ratings r
    LEFT JOIN users u ON r.user_id = u.user_id
    WHERE r.idln = ?
    ORDER BY r.created_at DESC`,
    [idln]
  );
  return rows;
}

module.exports = {
  getRatingByUser,
  getAverageRating,
  createRating,
  updateRating,
  deleteRating,
  getAllRatings,
};
