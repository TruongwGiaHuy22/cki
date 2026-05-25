
import { useState, useEffect } from "react";

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
// 💡 SUB-COMPONENT: Ô NHẬP TRẢ LỜI ĐỘC LẬP ĐỂ SỬA LỖI NHẢY CON TRỎ
// ========================================================
function ReplyForm({ commentId, submitting, onSubmit, onCancel }) {
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
// MAIN COMPONENT: QUẢN LÝ BÌNH LUẬN
// ========================================================
export default function Comments({ novelId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Parse user error:", e);
      }
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [novelId]);

  const fetchComments = async () => {
    try {
      const cleanId = Number(novelId);
      if (!cleanId || isNaN(cleanId)) return;

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/comments/novel/${cleanId}`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setComments(json.data);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để bình luận");
      return;
    }
    if (!newComment.trim()) {
      alert("Vui lòng nhập nội dung bình luận");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const cleanId = Number(novelId);
      if (isNaN(cleanId)) {
        alert("ID truyện không hợp lệ");
        return;
      }

      const res = await fetch("http://localhost:4000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          content: newComment.trim(),
          idln: cleanId,
          chapter_id: null,
          parent_id: null
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setNewComment("");
        await fetchComments();
      } else {
        alert(json.message || "Không thể gửi bình luận.");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Có lỗi xảy ra khi kết nối đến máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (targetId, replyContent) => {
    if (!user) {
      alert("Vui lòng đăng nhập để trả lời");
      return;
    }
    if (!replyContent || !replyContent.trim()) {
      alert("Vui lòng nhập nội dung trả lời");
      return;
    }

    // Thiết lập parent_id trực tiếp để hỗ trợ đệ quy đa tầng
    let finalParentId = targetId;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const cleanId = Number(novelId);

      const res = await fetch("http://localhost:4000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          content: replyContent.trim(),
          idln: cleanId,
          chapter_id: null,
          parent_id: finalParentId
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setReplyingTo(null);
        await fetchComments();
        
        const newExpanded = new Set(expandedReplies);
        newExpanded.add(finalParentId);
        setExpandedReplies(newExpanded);
      } else {
        alert(json.message || "Không thể gửi trả lời.");
      }
    } catch (err) {
      console.error("Error submitting reply:", err);
      alert("Có lỗi xảy ra khi kết nối đến máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      alert("Vui lòng đăng nhập để thích bình luận");
      return;
    }
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/comments/${commentId}/like`, {
        method: "POST",
        headers: { "Authorization": token ? `Bearer ${token}` : "" }
      });
      const json = await res.json();
      if (json.success) {
        await fetchComments();
      }
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) return;

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Authorization": token ? `Bearer ${token}` : "" }
      });
      const json = await res.json();
      if (json.success) {
        await fetchComments();
      } else {
        alert(json.message || "Xóa thất bại");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Vừa xong";
    
    const now = new Date();
    const diff = now - d;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Vừa xong";
    if (minutes < 60) return `${minutes}p trước`;
    if (hours < 24) return `${hours}h trước`;
    if (days < 7) return `${days}d trước`;
    return d.toLocaleDateString("vi-VN");
  };

  const UserBadges = ({ user: commentUser, isAuthor }) => {
    return (
      <div className="comment-user-info">
        <span className="comment-username">{commentUser.user_name}</span>
        {isAuthor && <span className="comment-badge author">AUTHOR</span>}
        {commentUser.role === "tacgia" && !isAuthor && (
          <span className="comment-badge creator">CHỦ TPOST</span>
        )}
      </div>
    );
  };

  // Component hiển thị một bình luận (Đã tối ưu cấu trúc lồng)
  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`comment-item ${isReply ? 'reply' : ''}`}>
      {/* Header */}
      <div className="comment-header">
        <UserBadges user={comment} isAuthor={comment.is_author} />
        <span className="comment-time">{formatDate(comment.created_at)}</span>
      </div>

      {/* Content */}
      <div className="comment-content">
        {comment.content}
      </div>

      {/* Actions */}
      <div className="comment-actions">
        <button onClick={() => handleLikeComment(comment.comment_id)} className="comment-btn like-btn">
          <span>👍</span>
          <span>{comment.like_count || 0}</span>
        </button>

        <button
          onClick={() => setReplyingTo(replyingTo === comment.comment_id ? null : comment.comment_id)}
          className="comment-btn"
        >
          💬 Trả lời
        </button>

        {comment.canDelete && (
          <button
            onClick={() => handleDeleteComment(comment.comment_id)}
            title={user?.user_id === comment.user_id ? "Xóa bình luận của bạn" : "Xóa bình luận (Quyền tác giả)"}
            className="comment-btn delete-btn"
          >
            🗑️ Xóa
          </button>
        )}
      </div>

      {/* Reply form */}
      {replyingTo === comment.comment_id && (
        <ReplyForm
          commentId={comment.comment_id}
          submitting={submitting}
          onSubmit={handleSubmitReply}
          onCancel={() => setReplyingTo(null)}
        />
      )}

      {/* Replies section */}
      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
        <div className="replies-section">
          <button onClick={() => toggleReplies(comment.comment_id)} className="replies-toggle-btn">
            {expandedReplies.has(comment.comment_id) ? "▼" : "▶"} {comment.replies.length} trả lời
          </button>

          {expandedReplies.has(comment.comment_id) && (
            <div className="replies-list">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.comment_id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );


  return (
    <div className="comments-container">
      <h3>💬 Bình luận ({countComments(comments)})</h3>

      <div className="comment-form">
        <textarea
          placeholder={user ? "Chia sẻ cảm nghĩ của bạn về bộ truyện này..." : "Vui lòng đăng nhập để tham gia bình luận"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!user || submitting}
          rows="4"
        />
        <button
          className="comment-submit-btn"
          onClick={handleSubmitComment}
          disabled={!user || submitting || !newComment.trim()}
        >
          {submitting ? "⏳ Đang gửi..." : "📤 Đăng bình luận"}
        </button>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="empty-comments">
            Chưa có bình luận nào. Hãy là người đầu tiên! 🎉
          </div>
        ) : (
          comments.map((comment) => <CommentItem key={comment.comment_id} comment={comment} isReply={false} />)
        )}
      </div>
    </div>
  );
}