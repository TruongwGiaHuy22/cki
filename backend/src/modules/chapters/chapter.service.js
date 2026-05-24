const pool = require("../../config/db");

exports.detail = async (id) => {
  const [[chapter]] = await pool.query(
    "SELECT chapter_id, idln, volume_id, chapter_number, title, content, created_at FROM chapters WHERE chapter_id = ?",
    [id]
  );
  return chapter;
};

exports.update = async (id, data) => {
  const { title, content } = data;
  
  const updateFields = [];
  const updateValues = [];

  if (title !== undefined) {
    updateFields.push("title = ?");
    updateValues.push(title);
  }

  if (content !== undefined) {
    updateFields.push("content = ?");
    updateValues.push(content);
    
    const wordCount = String(content).split(/\s+/).filter(w => w.length > 0).length;
    updateFields.push("word_count = ?");
    updateValues.push(wordCount);
  }

  if (updateFields.length === 0) {
    return exports.detail(id);
  }

  updateFields.push("updated_at = CURRENT_TIMESTAMP");
  
  const query = `UPDATE chapters SET ${updateFields.join(", ")} WHERE chapter_id = ?`;
  
  await pool.query(query, [...updateValues, id]);
  
  return exports.detail(id);
};
