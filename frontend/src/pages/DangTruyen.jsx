// D:\allwweb\maulightnovel\frontend\src\pages\DangTruyen.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:4000";

// Hàm tự động tạo Slug từ tiêu đề truyện
function toSlug(input) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function DangTruyen() {
  const navigate = useNavigate();

  // 1. Quản lý các State tập trung
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  const [genres, setGenres] = useState([]);
  const [message, setMessage] = useState("");
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
    genres: [], // Mảng lưu các id_tl được chọn
  });

  // 2. useEffect kiểm tra trạng thái đăng nhập khi vào trang
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setShowLoginMsg(true);
    }
  }, []);

  // 3. useEffect gọi API lấy danh sách Thể loại từ Backend
  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch(`${API_BASE}/api/theloai`);
        const json = await res.json();
        // Hỗ trợ cả trường hợp API trả về mảng trực tiếp hoặc bọc trong object .data
        setGenres(json.data || json);
      } catch (err) {
        console.error("Load genres error:", err);
      }
    }
    fetchGenres();
  }, []);

  // 4. Các hàm bổ trợ xử lý Form nhập liệu nằm trọn trong Component
  function setField(key, value) {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      // Nếu người dùng đang gõ Title, tự động gợi ý điền luôn vào ô Slug
      if (key === "title" && !prev.slug) {
        updated.slug = toSlug(value);
      }
      return updated;
    });
  }

  // Hàm xử lý chọn/bỏ chọn Checkbox Thể loại
  function toggleGenre(id, checked) {
    setForm((prev) => ({
      ...prev,
      genres: checked
        ? [...prev.genres, id]
        : prev.genres.filter((g) => g !== id),
    }));
  }

  // 5. Hàm gửi dữ liệu lên Backend khi nhấn Đăng truyện
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

    try {
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
    } catch (error) {
      setMessage("Lỗi kết nối đến Server.");
    }
  }

  // 6. Toàn bộ giao diện hiển thị JSX
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

        {showLoginMsg ? (
          <div style={{ color: "red", fontWeight: "bold", margin: "20px 0" }}>
            Bạn cần đăng nhập để đăng truyện
          </div>
        ) : (
          <form className="dangtruyen-form" onSubmit={handleSubmit}>
            <label>Tiêu đề <span>*</span></label>
            <input type="text" value={form.title} onChange={(e) => setField("title", e.target.value)} required />

            <label>Slug <span>*</span></label>
            <input type="text" value={form.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="Tên đường dẫn không dấu (ví dụ: ten-truyen)" required />

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
                  <input 
                    type="checkbox" 
                    checked={form.genres.includes(genre.id_tl)} 
                    onChange={(e) => toggleGenre(genre.id_tl, e.target.checked)} 
                  />
                  <span>{genre.ten_tl}</span>
                </label>
              ))}
            </div>

            <label>Mô tả <span>*</span></label>
            <textarea rows={8} value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Tóm tắt nội dung truyện..." required />

            <label></label>
            <div className="dangtruyen-actions">
              <button type="submit" className="dangtruyen-submit">Đăng truyện</button>
              {message ? <p style={{ marginTop: "10px", fontWeight: "bold" }}>{message}</p> : null}
            </div>
          </form>
        )}
      </section>
    </div>
  );
}