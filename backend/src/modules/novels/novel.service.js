const pool = require("../../config/db");

/* =======================
   UTIL
======================= */
function toSlug(input) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const safeStr = (v) => (typeof v === "string" ? v.trim() : "");
const safeNum = (v, def = 0) => (isNaN(Number(v)) ? def : Number(v));

/* =======================
   LIST
======================= */
async function list() {
  const [rows] = await pool.query(`
    SELECT
      q.idln,
      q.title,
      q.slug,
      q.cover,
      q.type,
      q.author,
      q.authordraw,
      q.description,
      q.statuss AS status,
      q.age_limit,
      q.total_chapters,
      q.total_words,
      q.view_count,
      q.follow_count,
      q.comment_count,
      q.rating_avg,
      q.rating_count,
      q.active,
      q.created_at,
      q.updated_at,
      GROUP_CONCAT(t.ten_tl ORDER BY t.ten_tl SEPARATOR '||') AS genres_raw
    FROM QLTT q
    LEFT JOIN truyen_theloai tt ON tt.idln = q.idln
    LEFT JOIN theloai t ON t.id_tl = tt.id_tl
    GROUP BY q.idln
    ORDER BY q.idln DESC
  `);

  return rows.map(r => ({
    ...r,
    genres: r.genres_raw ? r.genres_raw.split("||").filter(Boolean) : []
  }));
}

/* =======================
   LIST BY USER
======================= */
async function listByUser(userId) {
  const [rows] = await pool.query(`
    SELECT
      q.idln,
      q.title,
      q.slug,
      q.cover,
      q.type,
      q.author,
      q.authordraw,
      q.description,
      q.statuss AS status,
      q.age_limit,
      q.total_chapters,
      q.total_words,
      q.view_count,
      q.follow_count,
      q.comment_count,
      q.rating_avg,
      q.rating_count,
      q.active,
      q.created_at,
      q.updated_at,
      GROUP_CONCAT(t.ten_tl ORDER BY t.ten_tl SEPARATOR '||') AS genres_raw
    FROM QLTT q
    LEFT JOIN truyen_theloai tt ON tt.idln = q.idln
    LEFT JOIN theloai t ON t.id_tl = tt.id_tl
    WHERE q.created_by = ?
    GROUP BY q.idln
    ORDER BY q.idln DESC
  `, [userId]);

  return rows.map(r => ({
    ...r,
    genres: r.genres_raw ? r.genres_raw.split("||").filter(Boolean) : []
  }));
}

/* =======================
   GET BY ID
======================= */
async function getById(id) {
  const [rows] = await pool.query(`
    SELECT
      q.idln,
      q.title,
      q.slug,
      q.cover,
      q.type,
      q.author,
      q.authordraw,
      q.description,
      q.statuss AS status,
      q.age_limit
    FROM QLTT q
    WHERE q.idln = ?
    LIMIT 1
  `, [id]);

  if (!rows[0]) return null;

  const novel = rows[0];

  const [genres] = await pool.query(`
    SELECT t.ten_tl
    FROM truyen_theloai tt
    JOIN theloai t ON t.id_tl = tt.id_tl
    WHERE tt.idln = ?
  `, [id]);

  novel.genres = genres.map(g => g.ten_tl);

  return novel;
}

/* =======================
   CREATE (FIXED - NO BANNER)
======================= */
async function create(data, userId) {
  console.log("CREATE INPUT:", data);

  const title = safeStr(data.title);
  const author = safeStr(data.author);
  const authordraw = safeStr(data.authordraw);
  const cover = safeStr(data.cover);
  const description = safeStr(data.description);
  const type = safeStr(data.type) || "Truyện dịch";
  const statuss = safeStr(data.statuss) || "Đang tiến hành";

  let baseSlug =
    safeStr(data.slug) ? toSlug(data.slug) : toSlug(title);

  if (!baseSlug) baseSlug = `truyen-${Date.now()}`;

  let slug = baseSlug;
  let count = 1;

  while (true) {
    const [check] = await pool.query(
      "SELECT 1 FROM QLTT WHERE slug = ? LIMIT 1",
      [slug]
    );
    if (check.length === 0) break;
    slug = `${baseSlug}-${count++}`;
  }

  const age_limit = safeNum(data.age_limit, 0);

  /* INSERT (banner removed) */
  const [result] = await pool.query(
    `INSERT INTO QLTT
    (title, slug, cover, author, authordraw, description, type, statuss, age_limit, created_by, updated_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      slug,
      cover,
      author,
      authordraw,
      description,
      type,
      statuss,
      age_limit,
      userId,
      userId
    ]
  );

  const idln = result.insertId;

  /* GENRES */
  if (Array.isArray(data.genres)) {
    for (const g of data.genres) {
      const id_tl = Number(g);
      if (!isNaN(id_tl)) {
        await pool.query(
          "INSERT INTO truyen_theloai (idln, id_tl) VALUES (?, ?)",
          [idln, id_tl]
        );
      }
    }
  }

  return getById(idln);
}

/* =======================
   UPDATE
======================= */
async function update(id, data) {
  const map = {
    title: "title",
    author: "author",
    description: "description",
    status: "statuss",
    cover: "cover",
    authordraw: "authordraw",
    slug: "slug"
  };

  const fields = [];
  const values = [];

  for (const key in map) {
    if (data[key] !== undefined) {
      fields.push(`${map[key]} = ?`);

      values.push(
        key === "slug" ? toSlug(data[key]) : data[key]
      );
    }
  }

  if (!fields.length) return getById(id);

  await pool.query(
    `UPDATE QLTT SET ${fields.join(", ")} WHERE idln = ?`,
    [...values, id]
  );

  return getById(id);
}

/* =======================
   REMOVE
======================= */
async function remove(id) {
  const [res] = await pool.query(
    "DELETE FROM QLTT WHERE idln = ?",
    [id]
  );
  return res.affectedRows > 0;
}

/* =======================
   DETAIL
======================= */
async function detail(id) {
  const novel = await getById(id);
  if (!novel) return null;

  // Lấy danh sách volumes
  const [volumes] = await pool.query(
    "SELECT volume_id, idln, volume_number, title FROM volumes WHERE idln = ? ORDER BY volume_number ASC",
    [id]
  );

  // Lấy chapters cho mỗi volume
  for (let vol of volumes) {
    const [chapters] = await pool.query(
      "SELECT chapter_id, title, chapter_number, content FROM chapters WHERE idln = ? AND volume_id = ? ORDER BY chapter_number ASC",
      [id, vol.volume_id]
    );
    vol.chapters = chapters;
  }

  novel.volumes = volumes;
  return novel;
}

/* =======================
   CREATE VOLUME
======================= */
async function createVolume(novelId, data) {
  const idln = Number(novelId);
  const volume_number = safeNum(data.volume_number, 1);
  const title = safeStr(data.title) || `Volume ${volume_number}`;

  const [result] = await pool.query(
    "INSERT INTO volumes (idln, volume_number, title) VALUES (?, ?, ?)",
    [idln, volume_number, title]
  );

  return {
    volume_id: result.insertId,
    idln,
    volume_number,
    title,
    chapters: []
  };
}

/* =======================
   CREATE CHAPTER
======================= */
async function createChapter(novelId, data) {
  const idln = Number(novelId);
  const volume_id = safeNum(data.volume_id);
  const chapter_number = safeNum(data.chapter_number, 1);
  const title = safeStr(data.title) || `Chapter ${chapter_number}`;
  const slug = toSlug(title);
  const content = safeStr(data.content) || "";

  const [result] = await pool.query(
    `INSERT INTO chapters (idln, volume_id, chapter_number, title, slug, content, word_count)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [idln, volume_id, chapter_number, title, slug, content, content.split(" ").length]
  );

  return {
    chapter_id: result.insertId,
    idln,
    volume_id,
    chapter_number,
    title,
    slug,
    content,
    word_count: content.split(" ").length
  };
}

/* =======================
   DELETE VOLUME
======================= */
async function deleteVolume(volumeId) {
  if (!volumeId || isNaN(volumeId)) return false;
  
  // Xóa tất cả chapters trong volume
  await pool.query("DELETE FROM chapters WHERE volume_id = ?", [volumeId]);
  
  // Xóa volume
  const [result] = await pool.query("DELETE FROM volumes WHERE volume_id = ?", [volumeId]);
  
  return result.affectedRows > 0;
}

/* =======================
   DELETE CHAPTER
======================= */
async function deleteChapter(chapterId) {
  if (!chapterId || isNaN(chapterId)) return false;
  
  const [result] = await pool.query("DELETE FROM chapters WHERE chapter_id = ?", [chapterId]);
  
  return result.affectedRows > 0;
}

module.exports = {
  list,
  listByUser,
  getById,
  create,
  update,
  remove,
  detail,
  createVolume,
  createChapter,
  deleteVolume,
  deleteChapter
};