import React, { useState, useEffect } from "react";

export default function ForumCreate() {
  const ITEMS_PER_PAGE = 12;
  
  const [posts, setPosts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("Tất cả");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const categories = ["Tất cả", "Thông báo", "Tin tức", "Hỏi đáp", "Đánh giá", "Thảo luận"];

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Thảo luận");
  const [content, setContent] = useState("");

  // State cho Edit
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Hàm lấy Token an toàn
  const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

  // Lấy thông tin user hiện tại
  useEffect(() => {
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Parse user error:", e);
      }
    }
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:4000/api/forum/posts?category=${encodeURIComponent(currentCategory)}`;
      const token = getToken();

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setPosts(result.data || []);
      } else {
        // Chỉ log lỗi, không alert để tránh gây khó chịu khi list rỗng
        console.warn("Server phản hồi:", result.message);
        setPosts([]); 
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    setCurrentPage(1); // Reset về trang 1 khi đổi category
  }, [currentCategory]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    const token = getToken();
    
    if (!token) {
      alert("Vui lòng đăng nhập để đăng bài!");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/forum/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, category: formCategory }),
      });

      const result = await response.json();

      if (response.status === 201 || result.success) {
        alert("Đăng bài thành công!");
        setTitle("");
        setContent("");
        setFormCategory("Thảo luận");
        setShowCreateForm(false);
        fetchPosts(); 
      } else {
        alert("Lỗi: " + (result.message || "Không thể đăng bài"));
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối server. Vui lòng kiểm tra xem Backend đã bật chưa.");
    }
  };

  // Hàm xóa bài viết
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bài viết này?")) return;

    const token = getToken();
    if (!token) {
      alert("Vui lòng đăng nhập!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/forum/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok || result.success) {
        alert("Bài viết đã được xóa!");
        fetchPosts();
      } else {
        alert("Lỗi: " + (result.message || "Không thể xóa bài viết"));
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối server");
    }
  };

  // Hàm chỉnh sửa bài viết
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (!token) {
      alert("Vui lòng đăng nhập!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/forum/posts/${editingPostId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          category: editCategory,
        }),
      });

      const result = await response.json();

      if (response.ok || result.success) {
        alert("Bài viết đã được cập nhật!");
        setEditingPostId(null);
        fetchPosts();
      } else {
        alert("Lỗi: " + (result.message || "Không thể cập nhật bài viết"));
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối server");
    }
  };

  // Mở form edit
  const startEditing = (post) => {
    setEditingPostId(post.post_id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
  };

  // ... (Phần formatDate và return giữ nguyên như cũ)
  // Lưu ý: Đảm bảo phần render dùng post.post_id làm key như code cũ của bạn

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  return (
    <div style={styles.container}>
      
      {/* 🧭 THANH CÔNG CỤ: CHUYỂN TAB CHUYÊN MỤC & NÚT ĐĂNG BÀI */}
      <div style={styles.topBar}>
        <div style={styles.categoryNav}>
          {categories.map((cat) => (
            <button
              key={cat}
              style={{ ...styles.catBtn, ...(currentCategory === cat ? styles.catBtnActive : {}) }}
              onClick={() => {
                setCurrentCategory(cat);
                setShowCreateForm(false);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <button 
          style={{ ...styles.createBtn, background: showCreateForm ? "#ef4444" : "#3b82f6" }}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "❌ Hủy bỏ" : "➕ Thêm bài viết"}
        </button>
      </div>

      {/* 📝 GIAO DIỆN TẠO BÀI VIẾT */}
      {showCreateForm && (
        <div style={styles.formBox}>
          <h3 style={styles.formTitle}>Thảo luận / Bài viết</h3>
          <form onSubmit={handleSubmitPost}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tiêu đề *</label>
              <input 
                type="text" 
                style={styles.input} 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Nhập tiêu đề bài viết..."
                required 
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Nội dung *</label>
              <textarea 
                style={styles.textarea} 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Nhập nội dung chi tiết bài viết tại đây..."
                required 
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Chuyên mục *</label>
              <select 
                style={styles.select} 
                value={formCategory} 
                onChange={(e) => setFormCategory(e.target.value)}
              >
                <option value="Thông báo">Thông báo</option>
                <option value="Tin tức">Tin tức</option>
                <option value="Hỏi đáp">Hỏi đáp</option>
                <option value="Đánh giá">Đánh giá</option>
                <option value="Thảo luận">Thảo luận</option>
              </select>
            </div>

            <div style={{ textAlign: "left", marginTop: "1.5rem" }}>
              <button type="submit" style={styles.submitBtn}>Thêm bài viết</button>
            </div>
          </form>
        </div>
      )}

      {/* 🗂️ GIAO DIỆN DANH SÁCH BÀI VIẾT */}
      {!showCreateForm && (
        loading ? (
          <div style={styles.centerText}>🔄 Đang tải các bài viết...</div>
        ) : (
          <>
            {/* Form chỉnh sửa bài viết */}
            {editingPostId && (
              <div style={styles.formBox}>
                <h3 style={styles.formTitle}>Chỉnh sửa bài viết</h3>
                <form onSubmit={handleUpdatePost}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Tiêu đề *</label>
                    <input 
                      type="text" 
                      style={styles.input} 
                      value={editTitle} 
                      onChange={(e) => setEditTitle(e.target.value)} 
                      required 
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nội dung *</label>
                    <textarea 
                      style={styles.textarea} 
                      value={editContent} 
                      onChange={(e) => setEditContent(e.target.value)} 
                      required 
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Chuyên mục *</label>
                    <select 
                      style={styles.select} 
                      value={editCategory} 
                      onChange={(e) => setEditCategory(e.target.value)}
                    >
                      <option value="Thông báo">Thông báo</option>
                      <option value="Tin tức">Tin tức</option>
                      <option value="Hỏi đáp">Hỏi đáp</option>
                      <option value="Đánh giá">Đánh giá</option>
                      <option value="Thảo luận">Thảo luận</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button type="submit" style={styles.submitBtn}>Cập nhật bài viết</button>
                    <button type="button" style={{...styles.submitBtn, background: "#64748b"}} onClick={() => setEditingPostId(null)}>Hủy</button>
                  </div>
                </form>
              </div>
            )}

            <div style={styles.listBox}>
              {posts.length === 0 ? (
                <div style={styles.centerText}>Chưa có bài viết nào thuộc chuyên mục này!</div>
              ) : (
                paginatedPosts.map((post) => (
                  <div key={post.post_id} style={styles.postItem}>
                    <div style={styles.postMain}>
                      <div style={styles.titleWrapper}>
                        {post.is_pinned === 1 && <span style={styles.pinIcon}>⭐</span>}
                        <span style={styles.categoryTag}>[{post.category}]</span>
                        <a href={`/forum/${post.post_id}`} style={styles.postTitle}>{post.title}</a>
                      </div>
                      <div style={styles.postMeta}>
                        <span style={styles.authorName}>{post.username}</span>
                        {post.role === "Administrator" && <span style={styles.adminBadge}>Admin</span>}
                        <span style={styles.dot}>•</span>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>

                    <div style={styles.postActions}>
                      <div style={styles.postStats}>
                        <div style={styles.statBox}>
                          <span style={styles.statNum}>{post.comment_count}</span>
                          <span style={styles.statLabel}>Bình luận</span>
                        </div>
                        <div style={styles.statBox}>
                          <span style={styles.statNum}>{post.view_count}</span>
                          <span style={styles.statLabel}>Lượt xem</span>
                        </div>
                      </div>

                      {currentUser && currentUser.id === post.user_id && (
                        <div style={styles.actionButtons}>
                          <button 
                            style={styles.editBtn}
                            onClick={() => startEditing(post)}
                            title="Chỉnh sửa bài viết"
                            onMouseEnter={(e) => e.target.style.background = "#ea580c"}
                            onMouseLeave={(e) => e.target.style.background = "#f97316"}
                          >
                            ✏️ Sửa
                          </button>
                          <button 
                            style={styles.deleteBtn}
                            onClick={() => handleDeletePost(post.post_id)}
                            title="Xóa bài viết"
                            onMouseEnter={(e) => e.target.style.background = "#dc2626"}
                            onMouseLeave={(e) => e.target.style.background = "#ef4444"}
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 📄 PHÂN TRANG */}
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  style={{...styles.pageBtn, opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer"}}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Trước
                </button>

                <div style={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      style={{
                        ...styles.pageNumber,
                        ...(currentPage === page ? styles.pageNumberActive : {})
                      }}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  style={{...styles.pageBtn, opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer"}}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "1100px", margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui, -apple-system, sans-serif", color: "#cbd5e1" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", gap: "1rem" },
  categoryNav: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
  catBtn: { background: "#1f222a", color: "#94a3b8", border: "1px solid #2e3340", padding: "0.5rem 1rem", borderRadius: "0.375rem", cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s" },
  catBtnActive: { background: "#3b82f6", color: "#ffffff", borderColor: "#3b82f6" },
  createBtn: { color: "#fff", border: "none", padding: "0.5rem 1.25rem", borderRadius: "0.375rem", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem", whiteSpace: "nowrap" },
  formBox: { background: "#1f222a", padding: "2rem", borderRadius: "0.5rem", border: "1px solid #2e3340", marginBottom: "1.5rem" },
  formTitle: { fontSize: "1.2rem", fontWeight: "bold", color: "#fff", marginBottom: "1.5rem" },
  formGroup: { marginBottom: "1.25rem" },
  label: { display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#94a3b8" },
  input: { width: "100%", background: "#181a20", border: "1px solid #2e3340", color: "#fff", padding: "0.7rem", borderRadius: "4px", outline: "none" },
  textarea: { width: "100%", minHeight: "200px", background: "#181a20", border: "1px solid #2e3340", color: "#fff", padding: "0.7rem", borderRadius: "4px", outline: "none", resize: "vertical", fontFamily: "inherit" },
  select: { width: "100%", background: "#181a20", border: "1px solid #2e3340", color: "#fff", padding: "0.7rem", borderRadius: "4px", outline: "none" },
  submitBtn: { background: "#3b82f6", color: "#fff", border: "none", padding: "0.6rem 1.5rem", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.95rem" },
  listBox: { background: "#1f222a", border: "1px solid #2e3340", borderRadius: "0.5rem", overflow: "hidden" },
  postItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "1px solid #2e3340", gap: "1.5rem" },
  postMain: { display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1 },
  titleWrapper: { display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" },
  pinIcon: { color: "#eab308", fontSize: "1.1rem" },
  categoryTag: { fontSize: "0.8rem", fontWeight: "700", color: "#60a5fa" },
  postTitle: { fontSize: "1rem", fontWeight: "600", color: "#f8fafc", textDecoration: "none", lineHeight: "1.4" },
  postMeta: { display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#64748b" },
  authorName: { color: "#94a3b8", fontWeight: "500" },
  adminBadge: { background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "0.05rem 0.4rem", borderRadius: "0.25rem", fontSize: "0.75rem" },
  dot: { color: "#475569" },
  postStats: { display: "flex", gap: "1.5rem", textAlign: "center" },
  statBox: { display: "flex", flexDirection: "column", minWidth: "60px" },
  statNum: { fontSize: "1.05rem", fontWeight: "700", color: "#f1f5f9" },
  statLabel: { fontSize: "0.75rem", color: "#64748b", marginTop: "0.1rem" },
  centerText: { textAlign: "center", padding: "3rem", color: "#64748b" },
  postActions: { display: "flex", gap: "2rem", alignItems: "center", justifyContent: "flex-end" },
  actionButtons: { display: "flex", gap: "0.75rem" },
  editBtn: { 
    background: "#f97316",
    color: "#fff", 
    border: "none", 
    padding: "0.5rem 1rem", 
    borderRadius: "4px", 
    cursor: "pointer", 
    fontSize: "0.9rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    transition: "all 0.2s",
    whiteSpace: "nowrap"
  },
  deleteBtn: { 
    background: "#ef4444",
    color: "#fff", 
    border: "none", 
    padding: "0.5rem 1rem", 
    borderRadius: "4px", 
    cursor: "pointer", 
    fontSize: "0.9rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    transition: "all 0.2s",
    whiteSpace: "nowrap"
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "2rem",
    padding: "1.5rem",
    background: "#1f222a",
    borderRadius: "0.5rem",
    border: "1px solid #2e3340"
  },
  pageBtn: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "all 0.2s"
  },
  pageNumbers: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  pageNumber: {
    background: "#181a20",
    color: "#94a3b8",
    border: "1px solid #2e3340",
    padding: "0.5rem 0.75rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.2s",
    minWidth: "2.5rem",
    textAlign: "center"
  },
  pageNumberActive: {
    background: "#3b82f6",
    color: "#fff",
    borderColor: "#3b82f6"
  }
};