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
      q.created_by,
      q.created_at,
      q.updated_at,
      GROUP_CONCAT(t.ten_tl ORDER BY t.ten_tl SEPARATOR '||') AS genres_raw
    FROM QLTT q
    LEFT JOIN truyen_theloai tt ON tt.idln = q.idln
    LEFT JOIN theloai t ON t.id_tl = tt.id_tl
    WHERE q.active = 1
    GROUP BY q.idln
    ORDER BY q.idln DESC
  `);

  return rows.map(r => ({
    ...r,
    genres: r.genres_raw ? r.genres_raw.split("||").filter(Boolean) : []
  }));
}

/* =======================
   SEARCH BY TITLE
======================= */
async function searchByTitle(keyword) {
  if (!keyword || typeof keyword !== "string") return [];
  
  const searchTerm = keyword.trim();
  if (searchTerm.length === 0) return [];

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
    WHERE q.title LIKE ?
    GROUP BY q.idln
    ORDER BY q.title ASC
    LIMIT 20
  `, [`${searchTerm}%`]);

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
      q.created_by,
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
      q.age_limit,
      /* 💡 BỔ SUNG THÊM CÁC TRƯỜNG NÀY ĐỂ FRONTEND HIỂN THỊ */
      q.total_chapters,
      q.total_words,
      q.view_count AS views,      /* Alias lại thành views cho khớp novel.views ở Frontend */
      q.rating_avg AS rating,     /* Alias lại thành rating cho khớp novel.rating ở Frontend */
      q.rating_count,
      q.created_by,
      q.created_at,
      q.updated_at
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

  // Tính tổng word_count từ tất cả chapters
  const [totalWordsResult] = await pool.query(
    "SELECT COALESCE(SUM(word_count), 0) as total_words FROM chapters WHERE idln = ?",
    [id]
  );
  
  if (totalWordsResult[0]) {
    novel.total_words = totalWordsResult[0].total_words;
  }

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

  /* AUTO-PROMOTE USER TO AUTHOR ROLE */
  if (userId) {
    try {
      // Check current user role
      const [userRows] = await pool.query(
        "SELECT role FROM users WHERE user_id = ?",
        [userId]
      );
      
      // If user exists and is not already an author/admin, promote to author
      if (userRows.length > 0) {
        const userRole = userRows[0].role;
        if (userRole !== 'tacgia' && userRole !== 'admin' && userRole !== 'nhanvien') {
          await pool.query(
            "UPDATE users SET role = 'tacgia' WHERE user_id = ?",
            [userId]
          );
          console.log(`✅ User ${userId} promoted to author (tacgia)`);
        }
      }
    } catch (err) {
      console.error("⚠️ Error promoting user to author:", err.message);
      // Don't fail the novel creation if role update fails
    }
  }

  /* INSERT - Truyện mới sẽ chưa active (pending admin approval) */
  const [result] = await pool.query(
    `INSERT INTO QLTT
    (title, slug, cover, author, authordraw, description, type, statuss, age_limit, active, created_by, updated_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
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
  try {
    // Disable foreign key checks để xóa dễ dàng
    await pool.query("SET FOREIGN_KEY_CHECKS=0");
    
    // 1. Lấy tất cả volume_id của truyện này
    const [volumes] = await pool.query(
      "SELECT volume_id FROM volumes WHERE idln = ?",
      [id]
    );
    
    // 2. Xóa tất cả chapters của truyện này
    await pool.query("DELETE FROM chapters WHERE idln = ?", [id]);
    
    // 3. Xóa tất cả volumes của truyện này
    await pool.query("DELETE FROM volumes WHERE idln = ?", [id]);
    
    // 4. Xóa tất cả comments của truyện này
    await pool.query("DELETE FROM comments WHERE idln = ?", [id]);
    
    // 5. Xóa tất cả ratings của truyện này
    await pool.query("DELETE FROM ratings WHERE idln = ?", [id]);
    
    // 6. Xóa reading_history của truyện này
    await pool.query("DELETE FROM reading_history WHERE idln = ?", [id]);
    
    // 7. Xóa genre mappings của truyện này
    await pool.query("DELETE FROM truyen_theloai WHERE idln = ?", [id]);
    
    // 8. Cuối cùng xóa truyện
    const [res] = await pool.query(
      "DELETE FROM QLTT WHERE idln = ?",
      [id]
    );
    
    // Re-enable foreign key checks
    await pool.query("SET FOREIGN_KEY_CHECKS=1");
    
    return res.affectedRows > 0;
  } catch (err) {
    // Ensure foreign keys are re-enabled even if error
    await pool.query("SET FOREIGN_KEY_CHECKS=1");
    throw err;
  }
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

  let allChapters = [];

  // Lấy chapters cho mỗi volume
  for (let vol of volumes) {
    const [chapters] = await pool.query(
      "SELECT chapter_id, title, chapter_number, content, word_count, created_at FROM chapters WHERE idln = ? AND volume_id = ? ORDER BY chapter_number ASC",
      [id, vol.volume_id]
    );
    vol.chapters = chapters;
    // Collect tất cả chapters vào một mảng
    allChapters = allChapters.concat(chapters);
  }

  // Tính tổng word_count từ tất cả chapters
  const [totalWordsResult] = await pool.query(
    "SELECT COALESCE(SUM(word_count), 0) as total_words FROM chapters WHERE idln = ?",
    [id]
  );
  
  novel.total_words = totalWordsResult[0]?.total_words || 0;
  
  // Tính rating từ ratings table
  const [ratingResult] = await pool.query(
    "SELECT ROUND(AVG(rating), 1) as avg_rating, COUNT(*) as total_ratings FROM ratings WHERE idln = ?",
    [id]
  );
  
  novel.rating = ratingResult[0]?.avg_rating || 0;
  novel.rating_count = ratingResult[0]?.total_ratings || 0;
  
  novel.volumes = volumes;
  novel.chapters = allChapters; // Thêm danh sách tất cả chapters ở top level
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

/* =======================
   INCREMENT VIEW
======================= */
async function incrementView(novelId, userId) {
  // Kiểm tra novel tồn tại
  const [novel] = await pool.query("SELECT created_by FROM QLTT WHERE idln = ?", [novelId]);
  if (!novel || novel.length === 0) return false;

  // Nếu tác giả xem chính mình thì không tính
  if (userId && Number(novel[0].created_by) === Number(userId)) {
    return true; // Trả về true nhưng không increment
  }

  // Lấy hôm nay
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  // Kiểm tra xem hôm nay đã có record chưa
  const [existingView] = await pool.query(
    "SELECT view_id FROM novel_views WHERE idln = ? AND view_date = ?",
    [novelId, today]
  );

  if (existingView && existingView.length > 0) {
    // Cập nhật view_count
    await pool.query(
      "UPDATE novel_views SET view_count = view_count + 1 WHERE idln = ? AND view_date = ?",
      [novelId, today]
    );
  } else {
    // Tạo mới record
    await pool.query(
      "INSERT INTO novel_views (idln, view_date, view_count) VALUES (?, ?, 1)",
      [novelId, today]
    );
  }

  // Cập nhật tổng view_count trong QLTT
  const [totalViews] = await pool.query(
    "SELECT COALESCE(SUM(view_count), 0) as total_views FROM novel_views WHERE idln = ?",
    [novelId]
  );

  if (totalViews && totalViews.length > 0) {
    await pool.query(
      "UPDATE QLTT SET view_count = ? WHERE idln = ?",
      [totalViews[0].total_views, novelId]
    );
  }

  return true;
}

module.exports = {
  list,
  searchByTitle,
  listByUser,
  getById,
  create,
  update,
  remove,
  detail,
  createVolume,
  createChapter,
  deleteVolume,
  deleteChapter,
  incrementView
};