const pool = require("../../config/db");

exports.detail = async (id) => {
  const [[chapter]] = await pool.query(
    "SELECT chapter_id AS id, idln, volume_id, chapter_number, title, content FROM chapters WHERE chapter_id = ?",
    [id]
  );
  return chapter;
};
