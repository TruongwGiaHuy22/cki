const pool = require("../../config/db");

async function list() {
  const [rows] = await pool.query(
    `SELECT
      q.idln AS id,
      q.title,
      q.cover,
      q.type,
      q.author,
      q.authordraw,
      q.description,
      q.statuss AS status,
      GROUP_CONCAT(t.ten_tl ORDER BY t.ten_tl SEPARATOR '||') AS genres_raw
    FROM QLTT q
    LEFT JOIN truyen_theloai tt ON tt.idln = q.idln
    LEFT JOIN theloai t ON t.id_tl = tt.id_tl
    GROUP BY q.idln, q.title, q.cover, q.type, q.author, q.authordraw, q.description, q.statuss
    ORDER BY q.idln DESC`
  );
  return rows.map((r) => ({
    ...r,
    genres: r.genres_raw ? r.genres_raw.split("||").filter(Boolean) : [],
  }));
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT
      q.idln AS id,
      q.title,
      q.cover,
      q.type,
      q.author,
      q.authordraw,
      q.description,
      q.statuss AS status,
      GROUP_CONCAT(t.ten_tl ORDER BY t.ten_tl SEPARATOR '||') AS genres_raw
    FROM QLTT q
    LEFT JOIN truyen_theloai tt ON tt.idln = q.idln
    LEFT JOIN theloai t ON t.id_tl = tt.id_tl
    WHERE q.idln = ?
    GROUP BY q.idln, q.title, q.cover, q.type, q.author, q.authordraw, q.description, q.statuss
    LIMIT 1`,
    [id]
  );
  if (!rows[0]) return null;
  return {
    ...rows[0],
    genres: rows[0].genres_raw ? rows[0].genres_raw.split("||").filter(Boolean) : [],
  };
}

function toSlug(input) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function create(data, userId) {
  const slug = data.slug?.trim() ? toSlug(data.slug) : toSlug(data.title);
  const [result] = await pool.query(
    `INSERT INTO QLTT
      (title, slug, cover, banner, author, authordraw, description, type, statuss, age_limit, created_by, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      slug || null,
      data.cover || null,
      data.banner || null,
      data.author,
      data.authordraw || null,
      data.description || "",
      data.type || "Truyện dịch",
      data.statuss || "Đang tiến hành",
      Number(data.age_limit || 0),
      userId,
      userId,
    ]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const allowed = ["title", "author", "description", "status"];
  const entries = Object.entries(data).filter(([key]) => allowed.includes(key));
  if (!entries.length) return getById(id);

  // Map "status" to "statuss" for QLTT
  const mappedEntries = entries.map(([key, value]) => [key === "status" ? "statuss" : key, value]);
  const setClause = mappedEntries.map(([key]) => `${key} = ?`).join(", ");
  const values = mappedEntries.map(([, value]) => value);
  await pool.query(`UPDATE QLTT SET ${setClause} WHERE idln = ?`, [...values, id]);
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query("DELETE FROM QLTT WHERE idln = ?", [id]);
  return result.affectedRows > 0;
}

async function detail(id) {
  // Lấy truyện
  const [rows] = await pool.query(
    `SELECT
      q.idln AS id,
      q.title,
      q.cover,
      q.type,
      q.author,
      q.authordraw,
      q.description,
      q.statuss AS status
    FROM QLTT q
    WHERE q.idln = ?
    LIMIT 1`,
    [id]
  );
  if (!rows[0]) return null;
  const novel = rows[0];
  // Lấy thể loại
  const [genres] = await pool.query(
    `SELECT t.ten_tl FROM truyen_theloai tt
     JOIN theloai t ON tt.id_tl = t.id_tl
     WHERE tt.idln = ?`, [id]);
  novel.genres = genres.map(g => g.ten_tl);
  // Lấy volume + chapters theo volume nếu schema đã hỗ trợ
  try {
    const [volumeRows] = await pool.query(
      `SELECT
        v.volume_id AS volume_id,
        v.volume_number,
        v.title AS volume_title,
        NULL AS volume_cover,
        c.chapter_id AS chapter_id,
        c.title AS chapter_title
      FROM volumes v
      LEFT JOIN chapters c ON c.volume_id = v.volume_id
      WHERE v.idln = ?
      ORDER BY v.volume_number ASC, c.chapter_number ASC, c.chapter_id ASC`,
      [id]
    );

    if (volumeRows.length > 0) {
      const grouped = new Map();
      for (const row of volumeRows) {
        if (!grouped.has(row.volume_id)) {
          grouped.set(row.volume_id, {
            id: row.volume_id,
            volumeNumber: row.volume_number,
            title: row.volume_title,
            cover: row.volume_cover || null,
            chapters: [],
          });
        }
        if (row.chapter_id) {
          grouped.get(row.volume_id).chapters.push({
            id: row.chapter_id,
            title: row.chapter_title,
          });
        }
      }
      novel.volumes = Array.from(grouped.values());
      novel.chapters = novel.volumes.flatMap((v) => v.chapters);
      return novel;
    }
  } catch (_) {
    // Fallback cho DB cũ chưa có bảng volumes hoặc cột volume_id
  }

  // Fallback dữ liệu phẳng
  const [chapters] = await pool.query(
    "SELECT id_chuong AS id, title FROM chapters WHERE idln = ? ORDER BY id_chuong ASC",
    [id]
  );
  novel.chapters = chapters;
  novel.volumes = [
    {
      id: `legacy-${id}`,
      volumeNumber: 1,
      title: "Vol 1",
      cover: null,
      chapters,
    },
  ];
  return novel;
}

async function chapters(id) {
  const [rows] = await pool.query(
    "SELECT chapter_id AS id, title FROM chapters WHERE idln = ? ORDER BY chapter_number ASC, chapter_id ASC", [id]);
  return rows;
}

async function createVolume(idln, payload) {
  const volumeNumber = Number(payload.volume_number);
  const title = payload.title?.trim() || `Vol ${volumeNumber}`;
  const [existing] = await pool.query(
    "SELECT volume_id, idln, volume_number, title FROM volumes WHERE idln = ? AND volume_number = ? LIMIT 1",
    [idln, volumeNumber]
  );
  if (existing.length) return existing[0];

  const [result] = await pool.query(
    "INSERT INTO volumes (idln, volume_number, title) VALUES (?, ?, ?)",
    [idln, volumeNumber, title]
  );
  const [[created]] = await pool.query(
    "SELECT volume_id, idln, volume_number, title FROM volumes WHERE volume_id = ?",
    [result.insertId]
  );
  return created;
}

async function createChapter(idln, payload) {
  let volumeId = payload.volume_id ? Number(payload.volume_id) : null;
  if (!volumeId) {
    const volume = await createVolume(idln, {
      volume_number: Number(payload.volume_number || 1),
      title: payload.volume_title || `Vol ${Number(payload.volume_number || 1)}`,
    });
    volumeId = volume.volume_id;
  }

  const chapterNumber = Number(payload.chapter_number);
  const title = payload.title.trim();
  const content = payload.content || "";
  const slug = payload.slug?.trim() || null;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const [result] = await pool.query(
    `INSERT INTO chapters (idln, volume_id, chapter_number, title, slug, content, word_count)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [idln, volumeId, chapterNumber, title, slug, content, wordCount]
  );
  const [[created]] = await pool.query(
    `SELECT chapter_id AS id, idln, volume_id, chapter_number, title, slug, word_count, created_at
     FROM chapters WHERE chapter_id = ?`,
    [result.insertId]
  );
  return created;
}

module.exports = { list, getById, create, update, remove, detail, chapters, createVolume, createChapter };
