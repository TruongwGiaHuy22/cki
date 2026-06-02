import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNovels } from "../hooks/useNovels";

const API_BASE = "http://localhost:4000";

const formatPrice = (price) => {
  if (!price) return "—";
  const num = Number(price);
  if (isNaN(num)) return "—";
  return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" }).replace("₫", "VND").trim();
};

export default function XuatBan() {
  const navigate = useNavigate();
  const { novels, loading: novelsLoading } = useNovels();
  const [publishData, setPublishData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Hàm fetch dữ liệu
  const fetchPublishData = async () => {
    if (!novels || novels.length === 0) return;
    try {
      setLoading(true);
      const novelIds = novels.map(n => n.id);
      const results = [];

      // Dùng map và Promise.all để fetch song song cho nhanh
      const requests = novelIds.map(async (novelId) => {
        try {
          // Thêm cache: "no-store" để không dùng dữ liệu cũ
          const res = await fetch(`${API_BASE}/api/novel-publish/${novelId}`, { cache: "no-store" });
          const json = await res.json();
          if (res.ok && json.success && json.data) {
            const novelInfo = novels.find(n => n.id === novelId);
            const dataArr = Array.isArray(json.data) ? json.data : [json.data];
            return dataArr.map(item => ({
              ...item,
              novelId,
              genres: novelInfo?.genres || []
            }));
          }
        } catch (err) {
          console.log(`Failed to fetch publish info for novel ${novelId}`);
        }
        return [];
      });

      const responses = await Promise.all(requests);
      setPublishData(responses.flat());
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi tải dữ liệu xuất bản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishData();

    // Lắng nghe sự kiện cập nhật từ trang QuanLyXuatBan
    window.addEventListener("publishDataChanged", fetchPublishData);
    
    return () => {
      window.removeEventListener("publishDataChanged", fetchPublishData);
    };
  }, [novels]);

  const data = useMemo(() => publishData, [publishData]);
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  if (loading || novelsLoading) return <div className="xuatban-container">Đang tải dữ liệu...</div>;
  if (error) return <div className="xuatban-container">Lỗi: {error}</div>;
  if (data.length === 0) return <div className="xuatban-container">Không có thông tin xuất bản.</div>;

  const resolveCoverUrl = (cover) => {
    if (!cover) return "/favicon.svg";
    const cacheBuster = `t=${new Date().getTime()}`;

    if (cover.startsWith("http")) {
      return cover.includes("?") ? `${cover}&${cacheBuster}` : `${cover}?${cacheBuster}`;
    }

    if (cover.startsWith("/")) {
      return `${API_BASE}${cover}${cover.includes("?") ? "&" : "?"}${cacheBuster}`;
    }

    return `${API_BASE}/uploads/${cover}${cover.includes("?") ? "&" : "?"}${cacheBuster}`;
  };

  return (
    <div className="xuatban-container">
      <div className="xuatban-main">
        {currentData.map((item) => (
          <div key={item.publish_id} className="xuatban-item">
            <div className="xuatban-img">
              <img 
                src={resolveCoverUrl(item.cover)}
                alt={item.title} 
                onError={(e) => { e.target.src = "/favicon.svg"; }} 
              />
            </div>
            <div className="xuatban-content">
              <h2 className="xuatban-title">{item.title}</h2>
              <div className="xuatban-info">
                <p><b>Tác giả:</b> {item.author_name || "Ẩn danh"}</p>
                {item.illustrator_name && (<p><b>Họa sĩ:</b> {item.illustrator_name}</p>)}
                {item.genres && item.genres.length > 0 && (<p><b>Thể loại:</b> {item.genres.join(", ")}</p>)}
                <p><b>NXB:</b> {item.publisher_name || "-"}</p>
              </div>
              <p className="xuatban-desc">{item.short_description || "Không có mô tả."}</p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                {item.price && (
                  <div style={{ backgroundColor: "#FF6B6B", color: "white", padding: "1rem 1.5rem", borderRadius: "6px", textAlign: "center", fontWeight: "bold", fontSize: "1.1rem", whiteSpace: "nowrap" }}>
                    {formatPrice(item.price)}
                  </div>
                )}
                {item.buy_link && (
                  <a href={item.buy_link} target="_blank" rel="noopener noreferrer" className="xuatban-btn" style={{ backgroundColor: "#FF6B6B", textDecoration: "none", textAlign: "center", padding: "1rem 1.5rem", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: "bold", whiteSpace: "nowrap" }}>
                    🛒 {item.store_name || "Mua ngay"}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="xuatban-pagination">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} className={currentPage === page ? "active" : ""} onClick={() => setCurrentPage(page)}>{page}</button>
          ))}
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
        </div>
      </div>
    </div>
  );
}