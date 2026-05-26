import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ChapterList from "../compoment/chapterlist.jsx";
import { useNovels } from "../hooks/useNovels";
import Comments from "../compoment/Comments.jsx";
import RatingModal from "../compoment/RatingModal.jsx";

const API_BASE = "http://localhost:4000";

// Helper function để format ngày DD/MM/YYYY
function formatDate(timestamp) {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Helper function để format số với dấu phân cách
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// Hàm xử lý đường dẫn ảnh chuẩn
function resolveCover(cover) {
  // 1. Nếu không có ảnh, trả về ảnh mặc định trong thư mục public của frontend
  if (!cover) return "/default-novel.png"; 

  // 2. Nếu đã là đường dẫn đầy đủ từ internet (vd: từ các web khác)
  if (cover.startsWith("http")) return cover;

  // 3. Ghép tên file từ database với đường dẫn static của Backend
  // Đảm bảo tên file không bắt đầu bằng dấu / thừa
  const fileName = cover.replace(/^\/+/, "");
  return `${API_BASE}/uploads/${fileName}`;
}

export default function NovelDetail() {
  const { id } = useParams();
  const { novels, error: listError } = useNovels();
  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchNovelDetail = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/novels/${id}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Load novel detail failed");
      setNovel(json.data || null);
    } catch (e) {
      setError(e.message || "Có lỗi tải dữ liệu");
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        await fetchNovelDetail();
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  useEffect(() => {
    // Kiểm tra user từ localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentUser(true);
    }
  }, []);

  if (loading) return <div className="novelsdetail-p-4">Đang tải dữ liệu...</div>;
  if (error || listError) return <div className="novelsdetail-p-4">Lỗi: {error || listError}</div>;
  if (!novel) return <div className="novelsdetail-p-4">Không tìm thấy truyện.</div>;

  // Lấy dữ liệu từ danh sách cache hoặc từ API chi tiết
  const fallbackNovel = novels.find((n) => Number(n.id) === Number(id));
  const coverSrc = resolveCover(novel.cover || fallbackNovel?.cover);

  return (
    <div className="noveldetail-page">
      <section className="noveldetail-hero">
        <div className="noveldetail-cover-wrap">
          <div className="noveldetail-type-badge">{novel.type || "Truyện"}</div>
          <img 
            src={coverSrc} 
            alt={novel.title} 
            className="noveldetail-cover"
            onError={(e) => { e.target.src = "/default-novel.png"; }} // Nếu vẫn lỗi, hiển thị ảnh mặc định
          />
        </div>

        <div className="noveldetail-main">
          <h1 className="noveldetail-title">{novel.title}</h1>
          <div className="noveldetail-genres">
            {(novel.genres || []).map((g) => (
              <span key={g} className="noveldetail-chip">{g}</span>
            ))}
          </div>

          <div className="noveldetail-meta">
            <p><strong>Tác giả:</strong> {novel.author || "Ẩn danh"}</p>
            <p><strong>Họa sĩ:</strong> {novel.authordraw || "Đang cập nhật"}</p>
            <p><strong>Tình trạng:</strong> {novel.status || "Đang cập nhật"}</p>
          </div>

          <div className="noveldetail-stats">
            <div className="stat-item">
              <div className="stat-label">Lượt xem</div>
              <div className="stat-number" style={{ color: "#FF6B6B" }}>
                {formatNumber(novel.views || 0)}
              </div>
            </div>
            
            <div className="stat-item" onClick={() => setShowRatingModal(true)} style={{ cursor: "pointer" }}>
              <div className="stat-label">Đánh giá</div>
             
<div className="stat-number" style={{ color: "#FFD93D" }}>
  {/* Chuyển sang Number trước khi dùng toFixed để tránh lỗi crash */}
  {Number(novel.rating || 0).toFixed(1)}/5
</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Số từ</div>
              <div className="stat-number" style={{ color: "#4ECDC4" }}>
                {formatNumber(novel.total_words || 0)}
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Cập nhập</div>
              <div className="stat-number" style={{ color: "#94a3b8", fontSize: "16px" }}>
                {formatDate(novel.updated_at)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="noveldetail-section">
        <h2>Tóm tắt</h2>
        <p>{novel.description || "Chưa có mô tả."}</p>
      </section>

      <section className="noveldetail-section">
        <h2>Danh sách chương</h2>
        {((novel.chapters || []).length > 0 || (novel.volumes || []).length > 0) ? (
          <ChapterList chapters={novel.chapters} volumes={novel.volumes || []} />
        ) : (
          <p>Chưa có chương trong bộ truyện này.</p>
        )}
      </section>

      <section className="noveldetail-section" style={{ marginTop: "2rem" }}>
        <h2>Bình luận bộ truyện</h2>
        <Comments novelId={id} />
      </section>

      <Link to="/danhsach" className="noveldetail-back" style={{ display: "block", marginTop: "1.5rem" }}>
        ← Quay lại danh sách truyện
      </Link>

      <RatingModal 
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        novelId={id}
        currentUser={currentUser}
        onRatingSubmitted={() => fetchNovelDetail()}
      />
    </div>
  );
}