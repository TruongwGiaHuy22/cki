// D:\allwweb\maulightnovel\frontend\src\pages\DangTruyen.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  const location = useLocation();

  // 1. Quản lý các State tập trung
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  const [genres, setGenres] = useState([]);
  const [message, setMessage] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
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
    purchase_link: "", // Link mua truyện trên Shopee, Lazada, etc.
    store_name: "", // Tên cửa hàng (Shopee, Lazada, etc.)
    price: "", // Giá tiền
    publisher_name: "", // Tên nhà xuất bản
    translator_name: "", // Tên dịch giả (nếu là Truyện dịch)
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

  // Hàm xử lý upload ảnh bìa
  async function handleUploadCover(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("cover", file);

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/upload-cover`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        setField("cover", json.filename);
        setMessage("✅ Upload ảnh thành công!");
      } else {
        setMessage(`❌ Lỗi upload: ${json.message}`);
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối khi upload ảnh");
      console.error(err);
    } finally {
      setUploadLoading(false);
    }
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
      cover: form.cover.trim() || "noname29.png",
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

      const novelId = json.data.idln;
      setMessage(`Đăng truyện thành công: ${json.data.title}`);

      // Nếu là AI dịch/Truyện dịch + Hoàn thành, lưu thông tin xuất bản
      if ((form.type === "AI dịch" || form.type === "Truyện dịch") && form.statuss === "Hoàn thành" && form.purchase_link) {
        try {
          const publishRes = await fetch(`${API_BASE}/api/novel-publish`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              idln: novelId,
              title: form.title,
              cover: form.cover.trim() || "noname29.png",
              publisher_name: form.publisher_name || "",
              author_name: form.author || "",
              illustrator_name: form.authordraw || "",
              translator_name: form.translator_name || "",
              price: form.price ? Number(form.price) : null,
              buy_link: form.purchase_link,
              store_name: form.store_name || "",
            }),
          });

          const publishJson = await publishRes.json();
          if (publishRes.ok) {
            setMessage(`✅ Đăng truyện thành công và lưu thông tin xuất bản!`);
          } else {
            console.error("Lỗi lưu thông tin xuất bản:", publishJson.message);
          }
        } catch (publishErr) {
          console.error("Lỗi lưu thông tin xuất bản:", publishErr);
        }
      }
    } catch (error) {
      setMessage("Lỗi kết nối đến Server.");
    }
  }

  // 6. Toàn bộ giao diện hiển thị JSX
  return (
    <div className="dangtruyen-page">
      <nav className="dangtruyen-topnav">
        <button className={location.pathname === "/dang-truyen" ? "active" : ""} onClick={() => navigate("/dang-truyen")}>Thêm Truyện mới</button>
        <button className={location.pathname === "/quan-ly-truyen" ? "active" : ""} onClick={() => navigate("/quan-ly-truyen")}>Q.Lý truyện</button>
        <button className={location.pathname === "/quan-ly-xuat-ban" ? "active" : ""} onClick={() => navigate("/quan-ly-xuat-ban")}>Q.Lý Xuất bản</button>
        <button className={location.pathname === "/quan-ly-comment" ? "active" : ""} onClick={() => navigate("/quan-ly-comment")}>Q.Lý Comment</button>
        <button onClick={() => navigate("/error-report")}>Báo lỗi</button>
      </nav>
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
            <div style={{ 
              marginBottom: "15px", 
              padding: "12px 15px", 
              backgroundColor: "#fafafa", 
              borderRadius: "4px", 
              border: "1px solid #e0e0e0" 
            }}>
              <p style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "600", color: "#333" }}>📤 Upload ảnh từ máy</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleUploadCover}
                disabled={uploadLoading}
              />
              {uploadLoading && <p style={{ color: "#0066cc", margin: "8px 0 0 0", fontSize: "12px" }}>⏳ Đang upload...</p>}
              {form.cover && <p style={{ color: "#4caf50", margin: "8px 0 0 0", fontSize: "12px" }}>✅ Đã chọn: <strong>{form.cover}</strong></p>}
            </div>

            <div style={{ 
              marginBottom: "15px", 
              padding: "12px 15px", 
              backgroundColor: "#fafafa", 
              borderRadius: "4px", 
              border: "1px solid #e0e0e0" 
            }}>
              <p style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "600", color: "#333" }}>✏️ Hoặc gõ tên file ảnh</p>
              <input 
                type="text" 
                value={form.cover} 
                onChange={(e) => setField("cover", e.target.value)} 
                placeholder="VD: noname29.png, cover.jpg" 
              />
              <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#666" }}>💡 Mặc định: <code style={{ backgroundColor: "#e0e0e0", padding: "2px 5px", borderRadius: "3px", fontSize: "11px" }}>noname29.png</code></p>
            </div>

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

            {(form.type === "AI dịch" || form.type === "Truyện dịch") && form.statuss === "Hoàn thành" && (
              <>
                <label>📖 Thông Tin Xuất Bản</label>
                
                <div style={{ 
                  padding: "15px", 
                  backgroundColor: "#f0f8ff", 
                  borderRadius: "4px", 
                  border: "1px solid #b3d9ff",
                  marginBottom: "1.2rem"
                }}>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#333" }}>Tên Nhà Xuất Bản</label>
                    <input 
                      type="text" 
                      value={form.publisher_name} 
                      onChange={(e) => setField("publisher_name", e.target.value)} 
                      placeholder="VD: NXB Kim Đồng, NXB Trẻ" 
                      style={{ marginTop: "0.3rem", width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "3px", boxSizing: "border-box" }}
                    />
                  </div>

                  {form.type === "Truyện dịch" && (
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#333" }}>Tên Dịch Giả</label>
                      <input 
                        type="text" 
                        value={form.translator_name} 
                        onChange={(e) => setField("translator_name", e.target.value)} 
                        placeholder="Tên người dịch" 
                        style={{ marginTop: "0.3rem", width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "3px", boxSizing: "border-box" }}
                      />
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#333" }}>Giá Tiền (VND)</label>
                      <input 
                        type="number" 
                        value={form.price} 
                        onChange={(e) => setField("price", e.target.value)} 
                        placeholder="VD: 50000" 
                        step="1000"
                        style={{ marginTop: "0.3rem", width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "3px", boxSizing: "border-box" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#333" }}>Tên Cửa Hàng</label>
                      <select 
                        value={form.store_name} 
                        onChange={(e) => setField("store_name", e.target.value)} 
                        style={{ marginTop: "0.3rem", width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "3px", boxSizing: "border-box" }}
                      >
                        <option value="">-- Chọn cửa hàng --</option>
                        <option value="Shopee">Shopee</option>
                        <option value="Lazada">Lazada</option>
                        <option value="Tiki">Tiki</option>
                        <option value="Amazon">Amazon</option>
                        <option value="Fahasa">Fahasa</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#333" }}>Link Mua Truyện 🛒 <span style={{ color: "#d72222" }}>*</span></label>
                    <input 
                      type="url" 
                      value={form.purchase_link} 
                      onChange={(e) => setField("purchase_link", e.target.value)} 
                      placeholder="VD: https://shopee.vn/... hoặc https://lazada.vn/..." 
                      required
                      style={{ marginTop: "0.3rem", width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "3px", boxSizing: "border-box" }}
                    />
                  </div>

                  <p style={{ margin: "0.75rem 0 0 0", fontSize: "11px", color: "#666", fontStyle: "italic" }}>💡 Thêm thông tin này để độc giả có thể mua bản in hoặc phiên bản điện tử của truyện bạn.</p>
                </div>
              </>
            )}

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