import React, { useMemo, useState } from "react";
import { useNovels } from "../hooks/useNovels";

export default function XuatBan() {
  const { novels, loading, error } = useNovels();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const data = useMemo(() => novels, [novels]);
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="xuatban-container">Đang tải dữ liệu...</div>;
  if (error) return <div className="xuatban-container">Lỗi: {error}</div>;

  return <div className="xuatban-container"><div className="xuatban-main">{currentData.map((item) => (<div key={item.id} className="xuatban-item"><div className="xuatban-img"><img src={item.cover || "/favicon.svg"} alt={item.title} /></div><div className="xuatban-content"><h2 className="xuatban-title">{item.title}</h2><p className="xuatban-publisher">{item.type || "Không rõ thể loại"}</p><div className="xuatban-info"><p><b>Tác giả:</b> {item.author || "Ẩn danh"}</p><p><b>Thể loại:</b> {(item.genres && item.genres.join(", ")) || "-"}</p><p><b>Trạng thái:</b> {item.status || "-"}</p></div><p className="xuatban-desc">{item.description || "Không có mô tả."}</p><button className="xuatban-btn">Xem chi tiết</button></div></div>))}<div className="xuatban-pagination"><button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (<button key={page} className={currentPage === page ? "active" : ""} onClick={() => setCurrentPage(page)}>{page}</button>))}<button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button></div></div></div>;
}
