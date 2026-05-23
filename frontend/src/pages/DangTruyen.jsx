import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:4000";

function toSlug(input) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function DangTruyen() {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
  async function fetchGenres() {
    try {
      const res = await fetch(`${API_BASE}/api/theloai`);
      const json = await res.json();

      setGenres(json.data || json);
    } catch (err) {
      console.error("Load genres error:", err);
    }
  }

  fetchGenres();
}, []);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    cover: "",
    author: "",
    authordraw: "",
    type: "AI dịch",
    statuss: "Đang tiến hành",
    age_limit: "0",
    description: "",
    genres: [],
  });
  const [message, setMessage] = useState("");

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleGenre(genre, checked) {
    setForm((prev) => ({
      ...prev,
      genres: checked ? [...prev.genres, genre] : prev.genres.filter((g) => g !== genre),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return setMessage("Bạn cần đăng nhập trước.");

    const payload = {
      ...form,
      slug: form.slug.trim() || toSlug(form.title),
      cover: form.cover || "",
      authordraw: form.authordraw || "",
      description: form.description || "",
      age_limit: Number(form.age_limit || 0),
    };

    const res = await fetch(`${API_BASE}/api/novels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setMessage(`Lỗi: ${json.message || "Không thể đăng truyện"}`);
      return;
    }
    setMessage(`Đăng truyện thành công: ${json.data.title}`);
  }

  return (
    <div className="dangtruyen-page">
      <nav className="dangtruyen-topnav">
        <button className="active" onClick={() => navigate("/dang-truyen")}>Thêm Truyện mới</button>
        <button onClick={() => navigate("/quan-ly-truyen")}>Q.Lý truyện</button>
        <button>Q.Lý Convert</button>
        <button>Q.Lý Sáng tác</button>
        <button>Q.Lý Trang</button>
        <button>Tiện ích</button>
      </nav>

      <div className="dangtruyen-breadcrumb">Home</div>

      <section className="dangtruyen-card">
        <h2>Series</h2>
        <div className="dangtruyen-note">
          <p>Quy định chung khi đăng truyện tại <a href="#">đây</a></p>
          <p>Quy định về Truyện sáng tác tại <a href="#">đây</a></p>
          <p>Cần đọc <a href="#">Hướng dẫn đăng truyện</a></p>
        </div>

        <form className="dangtruyen-form" onSubmit={handleSubmit}>
          <label>Tiêu đề <span>*</span></label>
          <input type="text" value={form.title} onChange={(e) => setField("title", e.target.value)} required />

          <label>Slug <span>*</span></label>
          <input type="text" value={form.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="tu-dong-tu-tieu-de-va-cho-phep-sua" required />

          <label>Ảnh bìa</label>
          <input type="text" value={form.cover} onChange={(e) => setField("cover", e.target.value)} placeholder="URL hoặc đường dẫn ảnh bìa" />

          <label>Tác giả <span>*</span></label>
          <input type="text" value={form.author} onChange={(e) => setField("author", e.target.value)} required />

          <label>Họa sĩ</label>
          <input type="text" value={form.authordraw} onChange={(e) => setField("authordraw", e.target.value)} />

          <label>Loại truyện <span>*</span></label>
          <select value={form.type} onChange={(e) => setField("type", e.target.value)}>
            <option>AI dịch</option>
            <option>Sáng tác</option>
            <option>Truyện dịch</option>
          </select>

          <label>Tình trạng <span>*</span></label>
          <select value={form.statuss} onChange={(e) => setField("statuss", e.target.value)}>
            <option>Đang tiến hành</option>
            <option>Hoàn thành</option>
            <option>Tạm ngưng</option>
          </select>

          <label>Giới hạn độ tuổi</label>
          <select value={form.age_limit} onChange={(e) => setField("age_limit", e.target.value)}>
            <option value="0">0+</option>
            <option value="16">16+</option>
            <option value="18">18+</option>
          </select>

          <label>Thể loại</label>
          <div className="dangtruyen-genres">
            {genres.map((genre) => (
              <label key={genre.id_tl} className="dangtruyen-genre-item">
                <input type="checkbox" checked={form.genres.includes(genre.id_tl)} onChange={(e) => toggleGenre(genre.id_tl, e.target.checked)} />
                <span>{genre.ten_tl}</span>
              </label>
            ))}
          </div>

          <label>Mô tả <span>*</span></label>
          <textarea rows={8} value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Tóm tắt nội dung truyện..." required />

          <label></label>
          <div className="dangtruyen-actions">
            <button type="submit" className="dangtruyen-submit">Đăng truyện</button>
            {message ? <p>{message}</p> : null}
          </div>
        </form>
      </section>
    </div>
  );
}
