import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://localhost:4000";

export default function QuanLyComment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userNovels, setUserNovels] = useState([]);
  const [selectedNovelId, setSelectedNovelId] = useState(null);
  const [expandedCommentId, setExpandedCommentId] = useState(null);
  const [message, setMessage] = useState("");

  // Kiểm tra đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  // Lấy danh sách truyện của user
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    fetch(`${API_BASE}/api/novels/my`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.ok ? res.json() : Promise.reject("Lỗi lấy danh sách truyện"))
      .then(json => {
        const novelList = json.data || [];
        setUserNovels(novelList);
        if (novelList.length > 0) {
          setSelectedNovelId(novelList[0].idln);
        }
      })
      .catch(err => {
        console.error("Lỗi:", err);
        setError("Không thể lấy danh sách truyện");
      })
      .finally(() => setLoading(false));
  }, []);

  // Lấy comments cho truyện được chọn
  useEffect(() => {
    if (!selectedNovelId) return;

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    fetch(`${API_BASE}/api/comments/novel/${selectedNovelId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.ok ? res.json() : Promise.reject("Lỗi lấy comments"))
      .then(json => {
        setComments(json.data || []);
        setError("");
      })
      .catch(err => {
        console.error("Lỗi:", err);
        setError("Không thể lấy danh sách comment");
        setComments([]);
      })
      .finally(() => setLoading(false));
  }, [selectedNovelId]);

  // Xóa comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa comment này?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        setMessage("✅ Xóa comment thành công!");
        setComments(comments.filter(c => c.comment_id !== commentId));
        setTimeout(() => setMessage(""), 3000);
      } else {
        const json = await res.json();
        setMessage(`❌ Lỗi: ${json.message || "Xóa thất bại"}`);
      }
    } catch (err) {
      setMessage(`❌ Lỗi kết nối: ${err.message}`);
    }
  };

  if (loading) return (
    <div className="dangtruyen-page">
      <nav className="dangtruyen-topnav">
        <button className={location.pathname === "/dang-truyen" ? "active" : ""} onClick={() => navigate("/dang-truyen")}>Thêm Truyện mới</button>
        <button className={location.pathname === "/quan-ly-truyen" ? "active" : ""} onClick={() => navigate("/quan-ly-truyen")}>Q.Lý truyện</button>
        <button className={location.pathname === "/quan-ly-xuat-ban" ? "active" : ""} onClick={() => navigate("/quan-ly-xuat-ban")}>Q.Lý Xuất bản</button>
        <button className={location.pathname === "/quan-ly-comment" ? "active" : ""} onClick={() => navigate("/quan-ly-comment")}>Q.Lý Comment</button>
        <button onClick={() => navigate("/error-report")}>Báo lỗi</button>
      </nav>
      <div style={{ padding: "2rem" }}>Đang tải dữ liệu...</div>
    </div>
  );

  if (error && userNovels.length === 0) return (
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

      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1>Quản Lý Comment</h1>
        <p style={{ color: "#666", marginBottom: "2rem" }}>
          Quản lý tất cả comment từ các truyện bạn đã đăng
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

        {/* Chọn truyện */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>📖 Chọn truyện:</label>
          <select
            value={selectedNovelId || ""}
            onChange={(e) => setSelectedNovelId(Number(e.target.value))}
            style={{
              padding: "0.75rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              minWidth: "300px"
            }}
          >
            <option value="">-- Chọn truyện --</option>
            {userNovels.map(novel => (
              <option key={novel.idln} value={novel.idln}>
                {novel.title} ({novel.comment_count || 0} comment)
              </option>
            ))}
          </select>
        </div>

        {/* Danh sách comment */}
        {!selectedNovelId ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
            Vui lòng chọn một truyện để xem comment
          </div>
        ) : comments.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
            Truyện này chưa có comment nào.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {comments.map(comment => (
              <div
                key={comment.comment_id}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "1rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div>
                    <strong style={{ fontSize: "1.1rem", color: "#333" }}>
                      {comment.user_name || comment.username || "Ẩn danh"}
                    </strong>
                    <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
                      {new Date(comment.created_at).toLocaleString("vi-VN")}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.comment_id)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    🗑️ Xóa
                  </button>
                </div>

                <div style={{
                  backgroundColor: "#f9f9f9",
                  padding: "0.75rem",
                  borderRadius: "4px",
                  marginTop: "0.5rem",
                  cursor: "pointer",
                  border: expandedCommentId === comment.comment_id ? "2px solid #007bff" : "1px solid #e0e0e0"
                }}
                onClick={() => setExpandedCommentId(expandedCommentId === comment.comment_id ? null : comment.comment_id)}
                >
                  <div style={{ color: "#333", wordBreak: "break-word" }}>
                    {expandedCommentId === comment.comment_id ? (
                      <>
                        {comment.content}
                        <div style={{ fontSize: "0.85rem", color: "#999", marginTop: "0.5rem" }}>
                          👆 Click để thu gọn
                        </div>
                      </>
                    ) : (
                      <>
                        {comment.content.length > 100
                          ? comment.content.substring(0, 100) + "..."
                          : comment.content}
                        {comment.content.length > 100 && (
                          <div style={{ fontSize: "0.85rem", color: "#999", marginTop: "0.5rem" }}>
                            👇 Click để xem thêm
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {comment.chapter_id && (
                  <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
                    📌 Comment ở: Chương {comment.chapter_id}
                  </div>
                )}

                {comment.like_count > 0 && (
                  <div style={{ fontSize: "0.85rem", color: "#007bff", marginTop: "0.5rem" }}>
                    👍 {comment.like_count} like
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
