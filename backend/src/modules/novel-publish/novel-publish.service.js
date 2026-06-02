const pool = require("../../config/db");

const safeStr = (v) => (typeof v === "string" ? v.trim() : "");
const safeNum = (v, def = null) => (isNaN(Number(v)) ? def : Number(v));

async function ensureNovelOwner(idln, userId) {
  const [rows] = await pool.query(
    `SELECT created_by FROM QLTT WHERE idln = ?`,
    [idln]
  );

  if (rows.length === 0) {
    throw { statusCode: 404, message: "Novel not found" };
  }
  if (Number(rows[0].created_by) !== Number(userId)) {
    throw { statusCode: 403, message: "Unauthorized to manage this novel's publish info" };
  }
}

async function ensurePublishOwner(publish_id, userId) {
  const [rows] = await pool.query(
    `SELECT q.created_by
     FROM novel_publish np
     JOIN QLTT q ON q.idln = np.idln
     WHERE np.publish_id = ?`,
    [publish_id]
  );

  if (rows.length === 0) {
    throw { statusCode: 404, message: "Publish info not found" };
  }
  if (Number(rows[0].created_by) !== Number(userId)) {
    throw { statusCode: 403, message: "Unauthorized to manage this publish info" };
  }
}

async function create(data, userId = null) {
  const idln = Number(data.idln);
  if (!idln || isNaN(idln)) {
    throw { statusCode: 400, message: "Invalid novel ID" };
  }

  if (userId !== null && userId !== undefined) {
    await ensureNovelOwner(idln, userId);
  }

  const volume_number = safeNum(data.volume_number, 1);
  const title = safeStr(data.title);
  const cover = safeStr(data.cover);
  const publisher_name = safeStr(data.publisher_name);
  const author_name = safeStr(data.author_name);
  const illustrator_name = safeStr(data.illustrator_name);
  const translator_name = safeStr(data.translator_name);
  const total_pages = safeNum(data.total_pages);
  const release_date = data.release_date || new Date().toISOString().split('T')[0];
  const price = safeNum(data.price);
  const short_description = safeStr(data.short_description);
  const buy_link = safeStr(data.buy_link);
  const store_name = safeStr(data.store_name);

  const [result] = await pool.query(
    `INSERT INTO novel_publish 
    (idln, volume_number, title, cover, publisher_name, author_name, illustrator_name, 
     translator_name, total_pages, release_date, price, short_description, buy_link, store_name, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [idln, volume_number, title, cover, publisher_name, author_name, illustrator_name, 
     translator_name, total_pages, release_date, price, short_description, buy_link, store_name]
  );

  return {
    publish_id: result.insertId,
    idln,
    volume_number,
    title,
    cover,
    publisher_name,
    author_name,
    illustrator_name,
    translator_name,
    total_pages,
    release_date,
    price,
    short_description,
    buy_link,
    store_name,
    active: true,
    created_at: new Date()
  };
}

async function getByNovelId(idln) {
  // Join with QLTT (novels) to fetch latest cover from the novel record.
  // If novel_publish.cover is empty, we'll fallback to the novel's cover.
  const [rows] = await pool.query(
    `SELECT np.*, q.cover AS novel_cover
     FROM novel_publish np
     LEFT JOIN QLTT q ON q.idln = np.idln
     WHERE np.idln = ? AND np.active = 1
     ORDER BY np.volume_number ASC`,
    [idln]
  );

  return rows.map(r => ({
    ...r,
    cover: r.cover || r.novel_cover || null
  }));
}


async function update(publish_id, data, userId) {
  if (userId === null || userId === undefined) {
    throw { statusCode: 401, message: "Unauthorized" };
  }

  await ensurePublishOwner(publish_id, userId);

  const updates = [];
  const values = [];

  if (data.title !== undefined) {
    updates.push("title = ?");
    values.push(safeStr(data.title));
  }
  if (data.cover !== undefined) {
    updates.push("cover = ?");
    values.push(safeStr(data.cover));
  }
  if (data.price !== undefined) {
    updates.push("price = ?");
    values.push(safeNum(data.price));
  }
  if (data.buy_link !== undefined) {
    updates.push("buy_link = ?");
    values.push(safeStr(data.buy_link));
  }
  if (data.store_name !== undefined) {
    updates.push("store_name = ?");
    values.push(safeStr(data.store_name));
  }
  if (data.publisher_name !== undefined) {
    updates.push("publisher_name = ?");
    values.push(safeStr(data.publisher_name));
  }
  if (data.author_name !== undefined) {
    updates.push("author_name = ?");
    values.push(safeStr(data.author_name));
  }
  if (data.illustrator_name !== undefined) {
    updates.push("illustrator_name = ?");
    values.push(safeStr(data.illustrator_name));
  }

  if (updates.length === 0) return null;

  values.push(publish_id);

  const [result] = await pool.query(
    `UPDATE novel_publish SET ${updates.join(", ")} WHERE publish_id = ?`,
    values
  );

  if (result.affectedRows === 0) return null;

  const [rows] = await pool.query(
    `SELECT * FROM novel_publish WHERE publish_id = ?`,
    [publish_id]
  );

  return rows[0];
}

async function remove(publish_id, userId) {
  if (userId === null || userId === undefined) {
    throw { statusCode: 401, message: "Unauthorized" };
  }

  await ensurePublishOwner(publish_id, userId);

  const [result] = await pool.query(
    `UPDATE novel_publish SET active = 0 WHERE publish_id = ?`,
    [publish_id]
  );

  return result.affectedRows > 0;
}

module.exports = { create, getByNovelId, update, remove };
