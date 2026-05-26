import React, { useState, useEffect } from "react";

// Hàm đếm tổng số bình luận (bao gồm cả reply)
function countComments(comments) {
  let count = 0;
  for (const comment of comments) {
    count += 1;
    if (Array.isArray(comment.replies) && comment.replies.length > 0) {
      count += countComments(comment.replies);
    }
  }
  return count;
}

// ========================================================
// 💡 SUB-COMPONENT: Ô NHẬP TRẢ LỜI ĐỘC LẬP 
// ========================================================
function ForumReplyForm({ commentId, submitting, onSubmit, onCancel }) {
  const [text, setText] = useState("");

  return (
    <div className="reply-form-wrapper">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập trả lời của bạn..."
        rows="3"
        disabled={submitting}
        autoFocus
      />
      <div className="reply-form-buttons">
        <button
          onClick={() => onSubmit(commentId, text)}
          disabled={submitting || !text.trim()}
          className="reply-submit-btn"
        >
          {submitting ? "⏳ Đang gửi..." : "📤 Gửi"}
        </button>
        <button
          onClick={onCancel}
          className="reply-cancel-btn"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}

// ========================================================
// MAIN COMPONENT: QUẢN LÝ BÀI VIẾT VÀ BÌNH LUẬN FORUM
// ========================================================
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

  // State cho xem chi tiết bài viết và bình luận
  const [viewingPost, setViewingPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);
  const [submittingComment, setSubmittingComment] = useState(false);

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
    setCurrentPage(1);
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

  const startEditing = (post) => {
    setEditingPostId(post.post_id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "vừa xong";
    if (diffMins < 60) return `${diffMins}p trước`;
    if (diffHours < 24) return `${diffHours}h trước`;
    if (diffDays < 30) return `${diffDays} ngày trước`;
    
    return formatDate(dateString);
  };

  const viewPostDetail = async (post) => {
    setViewingPost(post);
    setComments([]);
    setCommentContent("");
    setExpandedReplies(new Set());
    setReplyingTo(null);
    setCommentsLoading(true);
    
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/forum/posts/${post.post_id}/comments`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const result = await response.json();
        setComments(result.data || []);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Lỗi tải bình luận:", error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      alert("Vui lòng nhập nội dung bình luận!");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("Vui lòng đăng nhập để bình luận!");
      return;
    }

    try {
      setSubmittingComment(true);
      console.log("Gửi bình luận:", { post_id: viewingPost.post_id, content: commentContent });
      
      const response = await fetch(`http://localhost:4000/api/forum/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          post_id: viewingPost.post_id, 
          content: commentContent,
          parent_id: null 
        }),
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response result:", result);

      if (response.status === 201 || response.ok || result.success) {
        setCommentContent("");
        await viewPostDetail(viewingPost);
        alert("✅ Bình luận thành công!");
      } else {
        alert("❌ Lỗi: " + (result.message || "Không thể tạo bình luận"));
      }
    } catch (error) {
      console.error("Lỗi chi tiết:", error);
      alert("❌ Lỗi kết nối server: " + error.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSubmitReply = async (targetId, replyContent) => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để trả lời");
      return;
    }
    if (!replyContent || !replyContent.trim()) {
      alert("Vui lòng nhập nội dung trả lời");
      return;
    }

    try {
      setSubmittingComment(true);
      const token = getToken();

      const response = await fetch(`http://localhost:4000/api/forum/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_id: viewingPost.post_id,
          content: replyContent.trim(),
          parent_id: targetId
        })
      });

      const result = await response.json();
      if (response.ok || result.success) {
        setReplyingTo(null);
        await viewPostDetail(viewingPost);
        
        const newExpanded = new Set(expandedReplies);
        newExpanded.add(targetId);
        setExpandedReplies(newExpanded);
      } else {
        alert("❌ Lỗi: " + (result.message || "Không thể gửi trả lời"));
      }
    } catch (err) {
      console.error("Lỗi gửi trả lời:", err);
      alert("Có lỗi xảy ra khi kết nối đến máy chủ.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để thích bình luận");
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        alert("Vui lòng đăng nhập!");
        return;
      }

      const response = await fetch(`http://localhost:4000/api/forum/comments/${commentId}/like`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Refresh comments để update like_count
        await viewPostDetail(viewingPost);
      } else {
        console.error("Like error:", result.message);
        alert("❌ Không thể thích bình luận: " + (result.message || "Lỗi không xác định"));
      }
    } catch (err) {
      console.error("Lỗi thích bình luận:", err);
      alert("❌ Lỗi kết nối: " + err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bình luận này?")) return;

    const token = getToken();
    if (!token) {
      alert("Vui lòng đăng nhập!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/forum/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok || result.success) {
        alert("✅ Bình luận đã được xóa!");
        await viewPostDetail(viewingPost);
      } else {
        alert("❌ Lỗi: " + (result.message || "Không thể xóa bình luận"));
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("❌ Lỗi kết nối server");
    }
  };

  const toggleReplies = (commentId) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  // Component hiển thị một bình luận
  const ForumCommentItem = ({ comment, isReply = false }) => (
    <div className={`comment-item ${isReply ? 'reply' : ''}`}>
      <div className="comment-header">
        <div className="comment-user-info">
          <span className="comment-username">{comment.username}</span>
          {comment.is_author && <span className="comment-badge author">CHỦ BÀI</span>}
          {comment.role === "Administrator" && !comment.is_author && (
            <span className="comment-badge creator">ADMIN</span>
          )}
        </div>
        <span className="comment-time">{formatRelativeTime(comment.created_at)}</span>
      </div>

      <div className="comment-content">
        {comment.content}
      </div>

      <div className="comment-actions">
        <button 
          onClick={() => handleLikeComment(comment.comment_id)} 
          className={`comment-btn like-btn ${comment.user_liked ? 'liked' : ''}`}
          title={comment.user_liked ? "Bỏ thích bình luận này" : "Thích bình luận này"}
        >
          <span>{comment.user_liked ? '❤️' : '👍'}</span>
          <span>{comment.like_count || 0}</span>
        </button>

        <button
          onClick={() => setReplyingTo(replyingTo === comment.comment_id ? null : comment.comment_id)}
          className="comment-btn reply-btn"
        >
          💬 Trả lời
        </button>

        {comment.canDelete && (
          <button
            onClick={() => handleDeleteComment(comment.comment_id)}
            title={(currentUser?.user_id || currentUser?.id) === comment.user_id ? "Xóa bình luận của bạn" : "Xóa bình luận (Quyền admin)"}
            className="comment-btn delete-btn"
          >
            🗑️ Xóa
          </button>
        )}
      </div>

      {replyingTo === comment.comment_id && (
        <ForumReplyForm
          commentId={comment.comment_id}
          submitting={submittingComment}
          onSubmit={handleSubmitReply}
          onCancel={() => setReplyingTo(null)}
        />
      )}

      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
        <div className="replies-section">
          <button onClick={() => toggleReplies(comment.comment_id)} className="replies-toggle-btn">
            {expandedReplies.has(comment.comment_id) ? "▼" : "▶"} {comment.replies.length} trả lời
          </button>

          {expandedReplies.has(comment.comment_id) && (
            <div className="replies-list">
              {comment.replies.map((reply) => (
                <ForumCommentItem key={reply.comment_id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Tính toán phân trang
  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  return (
    <div className="forum-container">
      
      {/* Nếu đang xem chi tiết bài viết */}
      {viewingPost ? (
        <>
          <button
            className="forum-submitBtn"
            onClick={() => setViewingPost(null)}
          >
            ← Quay lại
          </button>

          <div className="forum-postDetailBox">
            <div className="forum-postDetailHeader">
              <h2 className="forum-postDetailTitle">{viewingPost.title}</h2>
              <span className="forum-categoryTagDetail">[{viewingPost.category}]</span>
            </div>

            <div className="forum-postDetailMeta">
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img src="https://via.placeholder.com/40" alt="avatar" className="forum-smallAvatar" />
                <div>
                  <div className="forum-authorNameDetail">{viewingPost.username}</div>
                  {viewingPost.role === "Administrator" && (
                    <span className="forum-adminBadgeDetail">Administrator</span>
                  )}
                </div>
              </div>
              <div className="forum-postDetailTime">
                {formatDate(viewingPost.created_at)}
              </div>
            </div>

            <div className="forum-postDetailContent">
              {viewingPost.content}
            </div>

            <div className="forum-postDetailStats">
              <span>👁️ {viewingPost.view_count} lượt xem</span>
              <span>💬 {countComments(comments)} bình luận</span>
            </div>
          </div>

          {/* 💬 PHẦN BÌNH LUẬN */}
          <div className="forum-commentsSection">
            <h3 className="forum-commentsTitle">💬 Bình luận ({countComments(comments)})</h3>

            {currentUser ? (
              <form onSubmit={handleCreateComment} className="forum-commentForm">
                <textarea
                  className="forum-commentInput"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Chia sẻ cảm nghĩ của bạn..."
                  disabled={submittingComment}
                  rows="4"
                />
                <button type="submit" className="forum-submitCommentBtn" disabled={submittingComment || !commentContent.trim()}>
                  {submittingComment ? "⏳ Đang gửi..." : "📤 Đăng bình luận"}
                </button>
              </form>
            ) : (
              <div className="forum-loginPrompt">
                Vui lòng <a href="/login" style={{ color: "#3b82f6", textDecoration: "underline" }}>đăng nhập</a> để bình luận
              </div>
            )}

            <div className="comments-list">
              {commentsLoading ? (
                <div className="forum-centerText">Đang tải bình luận...</div>
              ) : comments.length === 0 ? (
                <div className="forum-centerText">Chưa có bình luận nào. Hãy là người đầu tiên! 🎉</div>
              ) : (
                comments.map((comment) => (
                  <ForumCommentItem key={comment.comment_id} comment={comment} isReply={false} />
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="forum-topBar">
            <div className="forum-categoryNav">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`forum-catBtn ${currentCategory === cat ? "active" : ""}`}
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
              className={`forum-createBtn ${showCreateForm ? "active" : ""}`}
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? "❌ Hủy bỏ" : "➕ Thêm bài viết"}
            </button>
          </div>

          {showCreateForm && (
            <div className="forum-formBox">
              <h3 className="forum-formTitle">Thảo luận / Bài viết</h3>
              <form onSubmit={handleSubmitPost}>
                <div className="forum-formGroup">
                  <label className="forum-label">Tiêu đề *</label>
                  <input 
                    type="text" 
                    className="forum-input" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Nhập tiêu đề bài viết..."
                    required 
                  />
                </div>

                <div className="forum-formGroup">
                  <label className="forum-label">Nội dung *</label>
                  <textarea 
                    className="forum-textarea" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder="Nhập nội dung chi tiết bài viết tại đây..."
                    required 
                  />
                </div>

                <div className="forum-formGroup">
                  <label className="forum-label">Chuyên mục *</label>
                  <select 
                    className="forum-select" 
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
                  <button type="submit" className="forum-submitBtn">Thêm bài viết</button>
                </div>
              </form>
            </div>
          )}

          {!showCreateForm && (
            loading ? (
              <div className="forum-centerText">🔄 Đang tải các bài viết...</div>
            ) : (
              <>
                {editingPostId && (
                  <div className="forum-formBox">
                    <h3 className="forum-formTitle">Chỉnh sửa bài viết</h3>
                    <form onSubmit={handleUpdatePost}>
                      <div className="forum-formGroup">
                        <label className="forum-label">Tiêu đề *</label>
                        <input 
                          type="text" 
                          className="forum-input" 
                          value={editTitle} 
                          onChange={(e) => setEditTitle(e.target.value)} 
                          required 
                        />
                      </div>

                      <div className="forum-formGroup">
                        <label className="forum-label">Nội dung *</label>
                        <textarea 
                          className="forum-textarea" 
                          value={editContent} 
                          onChange={(e) => setEditContent(e.target.value)} 
                          required 
                        />
                      </div>

                      <div className="forum-formGroup">
                        <label className="forum-label">Chuyên mục *</label>
                        <select 
                          className="forum-select" 
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
                        <button type="submit" className="forum-submitBtn">Cập nhật bài viết</button>
                        <button type="button" style={{background: "#64748b"}} className="forum-submitBtn" onClick={() => setEditingPostId(null)}>Hủy</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="forum-listBox">
                  {posts.length === 0 ? (
                    <div className="forum-centerText">Chưa có bài viết nào thuộc chuyên mục này!</div>
                  ) : (
                    paginatedPosts.map((post) => (
                      <div key={post.post_id} className="forum-postItem">
                        <div className="forum-postMain">
                          <div className="forum-titleWrapper">
                            {post.is_pinned === 1 && <span className="forum-pinIcon">⭐</span>}
                            <span className="forum-categoryTag">[{post.category}]</span>
                            <button
                              className="forum-postTitle"
                              onClick={() => viewPostDetail(post)}
                              title="Xem chi tiết bài viết"
                            >
                              {post.title}
                            </button>
                          </div>
                          <div className="forum-postMeta">
                            <span className="forum-authorName">{post.username}</span>
                            {post.role === "Administrator" && <span className="forum-adminBadge">Admin</span>}
                            <span className="forum-dot">•</span>
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                        </div>

                        <div className="forum-postActions">
                          <div className="forum-postStats">
                            <div className="forum-statBox">
                              <span className="forum-statNum">{post.comment_count}</span>
                              <span className="forum-statLabel">Bình luận</span>
                            </div>
                            <div className="forum-statBox">
                              <span className="forum-statNum">{post.view_count}</span>
                              <span className="forum-statLabel">Lượt xem</span>
                            </div>
                          </div>

                          {currentUser && currentUser.id === post.user_id && (
                            <div className="forum-actionButtons">
                              <button 
                                className="forum-editBtn"
                                onClick={() => startEditing(post)}
                                title="Chỉnh sửa bài viết"
                              >
                                ✏️ Sửa
                              </button>
                              <button 
                                className="forum-deleteBtn"
                                onClick={() => handleDeletePost(post.post_id)}
                                title="Xóa bài viết"
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

                {totalPages > 1 && (
                  <div className="forum-pagination">
                    <button
                      className="forum-pageBtn"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Trước
                    </button>

                    <div className="forum-pageNumbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`forum-pageNumber ${currentPage === page ? "active" : ""}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      className="forum-pageBtn"
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
        </>
      )}
    </div>
  );
};