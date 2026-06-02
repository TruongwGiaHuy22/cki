import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://localhost:4000";

// Hàm format giá tiền theo kiểu Việt Nam
const formatPrice = (price) => {
  if (!price) return "—";
  const num = Number(price);
  if (isNaN(num)) return "—";
  return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" }).replace("₫", "VND").trim();
};

export default function QuanLyXuatBan() {
  const navigate = useNavigate();
  const location = useLocation();
  const [novels, setNovels] = useState([]);
  const [publishList, setPublishList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchMyNovels() {
      try {
        const res = await fetch(`${API_BASE}/api/novels/my`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Lỗi khi lấy danh sách truyện cá nhân");
        }

        const data = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
        setNovels(data.map((novel) => ({ ...novel, id: novel.idln })));
      } catch (err) {
        console.error("Lỗi lấy danh sách truyện cá nhân:", err);
        setNovels([]);
      }
    }

    fetchMyNovels();
  }, [navigate]);

  // Lấy danh sách truyện AI dịch/Truyện dịch + hoàn thành (memoized để tránh reference change)
  const publishedNovels = useMemo(() => 
    novels.filter(
      n => (n.type === "AI dịch" || n.type === "Truyện dịch") && 
           (n.status === "Hoàn thành")
    ),
    [novels]
  );

  // Lấy thông tin xuất bản
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const results = [];

        for (const novel of publishedNovels) {
          try {
            // Sử dụng novel.id (đã được map từ idln bởi useNovels hook)
            const res = await fetch(`${API_BASE}/api/novel-publish/${novel.id}`);
            const json = await res.json();
            if (res.ok && json.success && json.data) {
              if (Array.isArray(json.data)) {
                results.push(...json.data.map(item => ({
                  ...item,
                  novelInfo: novel
                })));
              } else {
                results.push({
                  ...json.data,
                  novelInfo: novel
                });
              }
            }
          } catch (err) {
            console.error(`Lỗi lấy xuất bản cho truyện ${novel.id}`);
          }
        }
        setPublishList(results);
        setError("");
      } catch (err) {
        setError(err.message || "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }

    if (publishedNovels.length > 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [publishedNovels]);

  const handleEdit = (item) => {
    setEditingId(item.publish_id);
    setEditForm({
      publish_id: item.publish_id,
      title: item.title,
      price: item.price,
      buy_link: item.buy_link,
      store_name: item.store_name,
      publisher_name: item.publisher_name,
      author_name: item.author_name,
      illustrator_name: item.illustrator_name
    });
    setMessage("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setMessage("❌ Bạn cần đăng nhập");
        return;
      }

      const res = await fetch(`${API_BASE}/api/novel-publish/${editForm.publish_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editForm.title,
          price: editForm.price ? Number(editForm.price) : null,
          buy_link: editForm.buy_link,
          store_name: editForm.store_name,
          publisher_name: editForm.publisher_name,
          author_name: editForm.author_name,
          illustrator_name: editForm.illustrator_name
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMessage("✅ Cập nhật thành công!");
        
        // Phát tín hiệu để các trang khác biết dữ liệu đã thay đổi
        window.dispatchEvent(new Event("publishDataChanged"));

        setPublishList(prev => prev.map(item =>
          item.publish_id === editForm.publish_id ? { ...item, ...editForm } : item
        ));
        setEditingId(null);
        setEditForm({});
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`❌ Lỗi: ${json.message || "Cập nhật thất bại"}`);
      }
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  if (loading) return (
    <div className="dangtruyen-page">
      <nav className="dangtruyen-topnav">
        <button className={location.pathname === "/dang-truyen" ? "active" : ""} onClick={() => navigate("/dang-truyen")}>Thêm Truyện mới</button>
        <button className={location.pathname === "/quan-ly-truyen" ? "active" : ""} onClick={() => navigate("/quan-ly-truyen")}>Q.Lý truyện</button>
        <button className={location.pathname === "/quan-ly-xuat-ban" ? "active" : ""} onClick={() => navigate("/quan-ly-xuat-ban")}>Q.Lý Xuất bản</button>
        <button>Q.Lý Sáng tác</button>
        <button onClick={() => navigate("/error-report")}>Báo lỗi</button>
      </nav>
      <div style={{ padding: "2rem" }}>Đang tải dữ liệu...</div>
    </div>
  );

  if (error) return (
    <div className="dangtruyen-page">
      <nav className="dangtruyen-topnav">
        <button className={location.pathname === "/dang-truyen" ? "active" : ""} onClick={() => navigate("/dang-truyen")}>Thêm Truyện mới</button>
        <button className={location.pathname === "/quan-ly-truyen" ? "active" : ""} onClick={() => navigate("/quan-ly-truyen")}>Q.Lý truyện</button>
        <button className={location.pathname === "/quan-ly-xuat-ban" ? "active" : ""} onClick={() => navigate("/quan-ly-xuat-ban")}>Q.Lý Xuất bản</button>
        <button className={location.pathname === "/quan-ly-comment" ? "active" : ""} onClick={() => navigate("/quan-ly-comment")}>Q.Lý Comment</button>
        <button onClick={() => navigate("/error-report")}>Báo lỗi</button>
      </nav>
      <div style={{ padding: "2rem", color: "red" }}>Lỗi: {error}</div>
    </div>
  );

  return (
    <div className="dangtruyen-page">
      <nav className="dangtruyen-topnav">
        <button className={location.pathname === "/dang-truyen" ? "active" : ""} onClick={() => navigate("/dang-truyen")}>Thêm Truyện mới</button>
        <button className={location.pathname === "/quan-ly-truyen" ? "active" : ""} onClick={() => navigate("/quan-ly-truyen")}>Q.Lý truyện</button>
        <button className={location.pathname === "/quan-ly-xuat-ban" ? "active" : ""} onClick={() => navigate("/quan-ly-xuat-ban")}>Q.Lý Xuất bản</button>
        <button className={location.pathname === "/quan-ly-comment" ? "active" : ""} onClick={() => navigate("/quan-ly-comment")}>Q.Lý Comment</button>
        <button onClick={() => navigate("/error-report")}>Báo lỗi</button>
      </nav>

      <div style={{ padding: "2rem" }}>
        <h1>Quản Lý Xuất Bản</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          Quản lý thông tin xuất bản cho các truyện AI dịch / Truyện dịch hoàn thành
        </p>

        {message && (
          <div style={{
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da",
            color: message.includes("✅") ? "#155724" : "#721c24",
            fontWeight: "600"
          }}>
            {message}
          </div>
        )}

        {publishList.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
            Không có truyện nào để quản lý xuất bản.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "1rem", textAlign: "left" }}>Tiêu đề</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Tác giả</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Giá (VND)</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Cửa hàng</th>
              <th style={{ padding: "1rem", textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {publishList.map((item) => (
              <tr key={item.publish_id} style={{ borderBottom: "1px solid #ddd" }}>
                {editingId === item.publish_id ? (
                  <>
                    <td style={{ padding: "1rem" }}>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                      />
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <input
                        type="text"
                        value={editForm.author_name}
                        onChange={(e) => setEditForm({ ...editForm, author_name: e.target.value })}
                        style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                      />
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <input
                        type="number"
                        value={editForm.price || ""}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                      />
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <select
                        value={editForm.store_name || ""}
                        onChange={(e) => setEditForm({ ...editForm, store_name: e.target.value })}
                        style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                      >
                        <option value="">-- Chọn cửa hàng --</option>
                        <option value="Shopee">Shopee</option>
                        <option value="Lazada">Lazada</option>
                        <option value="Tiki">Tiki</option>
                        <option value="Amazon">Amazon</option>
                        <option value="Fahasa">Fahasa</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <button
                        onClick={handleSave}
                        style={{
                          padding: "0.5rem 1rem",
                          marginRight: "0.5rem",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "600"
                        }}
                      >
                        Lưu
                      </button>
                      <button
                        onClick={handleCancel}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#6c757d",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "600"
                        }}
                      >
                        Hủy
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: "1rem" }}><strong>{item.title}</strong></td>
                    <td style={{ padding: "1rem" }}>{item.author_name}</td>
                    <td style={{ padding: "1rem", color: "#FF6B6B", fontWeight: "bold" }}>
                      {formatPrice(item.price)}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "12px",
                        fontSize: "0.9rem",
                        fontWeight: "600"
                      }}>
                        {item.store_name || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "600"
                        }}
                      >
                        ✏️ Sửa
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
          </div>
        )}

        {editingId && (
          <div style={{
            marginTop: "2rem",
            padding: "1.5rem",
            backgroundColor: "#f0f8ff",
            borderRadius: "4px",
            border: "1px solid #b3d9ff"
          }}>
            <h3>Chi tiết chỉnh sửa</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <div>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Giá tiền (VND)</label>
                <input
                  type="number"
                  value={editForm.price || ""}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  placeholder="175000"
                  style={{ width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "4px", boxSizing: "border-box" }}
                />
                {editForm.price && (
                  <div style={{ marginTop: "0.5rem", padding: "0.5rem", backgroundColor: "#FF6B6B", color: "white", borderRadius: "4px", fontWeight: "bold", textAlign: "center" }}>
                    Xem trước: {formatPrice(editForm.price)}
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Link mua 🛒</label>
                <input
                  type="url"
                  value={editForm.buy_link || ""}
                  onChange={(e) => setEditForm({ ...editForm, buy_link: e.target.value })}
                  placeholder="https://..."
                  style={{ width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "4px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Nhà xuất bản</label>
                <input
                  type="text"
                  value={editForm.publisher_name || ""}
                  onChange={(e) => setEditForm({ ...editForm, publisher_name: e.target.value })}
                  placeholder="NXB Kim Đồng, NXB Trẻ..."
                  style={{ width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "4px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>Họa sĩ</label>
                <input
                  type="text"
                  value={editForm.illustrator_name || ""}
                  onChange={(e) => setEditForm({ ...editForm, illustrator_name: e.target.value })}
                  placeholder="Tên họa sĩ..."
                  style={{ width: "100%", padding: "0.6rem", border: "1px solid #ddd", borderRadius: "4px", boxSizing: "border-box" }}
                />
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
          <h3>Chỉ có thể quản lý truyện loại:</h3>
          <ul style={{ color: "#666" }}>
            <li><strong>AI dịch</strong> + Hoàn thành</li>
            <li><strong>Truyện dịch</strong> + Hoàn thành</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
