// D:\allwweb\maulightnovel\frontend\src\pages\QuanLyTruyen.jsx

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://localhost:4000";

// Hàm format ngày thành DD/MM/YYYY
function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "";
  }
}

export default function QuanLyTruyen() {
  const navigate = useNavigate();
  const location = useLocation();

  // Khởi tạo state mặc định
  const [novels, setNovels] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [editingChapter, setEditingChapter] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showVolumeMenu, setShowVolumeMenu] = useState(false);
  const [selectedVolumeForDelete, setSelectedVolumeForDelete] = useState(null);

  // 1. Kiểm tra quyền đăng nhập ngay khi vào trang
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  // 2. Tải danh sách truyện - Chỉ những truyện do tài khoản này tạo (created_by)
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
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi Server 500 hoặc sai phân quyền.");
        return res.json();
      })
      .then((json) => {
        if (json && Array.isArray(json.data)) {
          setNovels(json.data);
        } else if (Array.isArray(json)) {
          setNovels(json);
        } else {
          setNovels([]);
        }
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách truyện cá nhân:", err);
        setNovels([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // 3. Mở xem chi tiết tập và chương của một bộ truyện
  async function openNovel(novel) {
    // Nếu truyện đã được chọn, bấm lần thứ 2 thì deselect
    if (selectedNovel?.idln === novel.idln) {
      setSelectedNovel(null);
      setDetail(null);
      setSelectedChapter(null);
      return;
    }

    setSelectedNovel(novel);
    setSelectedChapter(null);
    try {
      const res = await fetch(`${API_BASE}/api/novels/${novel.idln}`);
      
      // BẪY LỖI: Nếu server có lỗi thì ném ra Error để nhảy vào khối catch xử lý dứt điểm
      if (!res.ok) {
        throw new Error(`Server báo lỗi: ${res.status}`);
      }
      
      const json = await res.json();
      setDetail(json.data || json);
    } catch (err) {
      console.error("Lỗi khi fetch chi tiết truyện:", err);
      // Bạn có thể alert hoặc setDetail(null) tùy ý để không bị treo giao diện
    }
  }

  // Tải lại dữ liệu truyện đang chọn sau khi thêm tập/chương (GIỮ LẠI selectedChapter)
  async function reloadCurrentNovel() {
    if (!selectedNovel) return;
    try {
      const res = await fetch(`${API_BASE}/api/novels/${selectedNovel.idln}`);
      
      if (!res.ok) {
        throw new Error(`Server báo lỗi: ${res.status}`);
      }
      
      const json = await res.json();
      setDetail(json.data || json);
      // ✅ KHÔNG RESET selectedChapter - giữ lại chapter đang chọn
    } catch (err) {
      console.error("Lỗi khi reload chi tiết truyện:", err);
    }
  }

  // 4. Gọi API tạo Volume mới
  async function createVolume(idln) {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const nextVolumeNumber = (detail.volumes?.length || 0) + 1;
      
      const res = await fetch(`${API_BASE}/api/novels/${idln}/volumes`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          volume_number: nextVolumeNumber,
          title: `Volume ${nextVolumeNumber}`,
        }),
      });
      
      if (res.ok) {
        setShowVolumeMenu(false);
        reloadCurrentNovel();
        alert("✅ Tạo volume thành công!");
      } else {
        alert("❌ Lỗi tạo volume!");
      }
    } catch (err) {
      console.error("Lỗi tạo volume:", err);
      alert("❌ Lỗi kết nối!");
    }
  }

  // 5. Xóa Volume
  async function deleteVolume(volumeId) {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/novels/volume/${volumeId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        setShowVolumeMenu(false);
        setSelectedVolumeForDelete(null);
        reloadCurrentNovel();
        alert("✅ Xóa volume thành công!");
      } else {
        alert("❌ Lỗi xóa volume!");
      }
    } catch (err) {
      console.error("Lỗi xóa volume:", err);
      alert("❌ Lỗi kết nối!");
    }
  }

  // 6. Xóa Truyện
  async function deleteNovel() {
    if (!selectedNovel) return;
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!window.confirm(`⚠️ Bạn chắc chắn muốn xóa truyện "${selectedNovel.title}"? Hành động này không thể hoàn tác!`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/novels/${selectedNovel.idln}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        setShowVolumeMenu(false);
        setSelectedNovel(null);
        setDetail(null);
        setNovels(novels.filter(n => n.idln !== selectedNovel.idln));
        alert("✅ Xóa truyện thành công!");
      } else {
        alert("❌ Lỗi xóa truyện!");
      }
    } catch (err) {
      console.error("Lỗi xóa truyện:", err);
      alert("❌ Lỗi kết nối!");
    }
  }

  // 7. Gọi API tạo Chapter mới
  async function createChapter(volume_id) {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const currentVolume = detail.volumes?.find(v => v.volume_id === volume_id);
      const nextChapterNumber = (currentVolume?.chapters?.length || 0) + 1;
      
      const res = await fetch(`${API_BASE}/api/novels/${selectedNovel.idln}/chapters`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          volume_id,
          chapter_number: nextChapterNumber,
          title: `Chương ${nextChapterNumber}`,
          content: "",
        }),
      });
      
      if (res.ok) {
        reloadCurrentNovel();
        alert("✅ Tạo chapter thành công!");
      } else {
        alert("❌ Lỗi tạo chapter!");
      }
    } catch (err) {
      console.error("Lỗi tạo chapter:", err);
      alert("❌ Lỗi kết nối!");
    }
  }

  // 8. Xóa Chapter
  async function deleteChapter(chapterId) {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!window.confirm("⚠️ Bạn chắc chắn muốn xóa chapter này?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/novels/chapter/${chapterId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        setSelectedChapter(null);
        reloadCurrentNovel();
        alert("✅ Xóa chapter thành công!");
      } else {
        alert("❌ Lỗi xóa chapter!");
      }
    } catch (err) {
      console.error("Lỗi xóa chapter:", err);
      alert("❌ Lỗi kết nối!");
    }
  }

  // Mở modal chỉnh sửa chapter
  async function openEditChapter(chapter) {
    const chId = chapter.chapter_id || chapter.id;
    if (!chId) {
      alert("Lỗi: Chapter không hợp lệ");
      return;
    }
    setSelectedChapter(chId);
    try {
      const res = await fetch(`${API_BASE}/api/chapters/${chId}`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        setEditingChapter({ ...data, chapter_id: chId });
      } else {
        setEditingChapter({ ...chapter, chapter_id: chId });
      }
    } catch (err) {
      console.error("Lỗi tải chi tiết chapter:", err);
      setEditingChapter({ ...chapter, chapter_id: chId });
    }
    setIsEditModalOpen(true);
  }

  // Cập nhật chapter
  async function updateChapter() {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!editingChapter) return;

    try {
      const res = await fetch(`${API_BASE}/api/chapters/${editingChapter.chapter_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editingChapter.title,
          content: editingChapter.content
        })
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        reloadCurrentNovel();
        alert("✅ Cập nhật chapter thành công!");
      } else {
        alert("❌ Lỗi cập nhật chapter!");
      }
    } catch (err) {
      console.error("Lỗi cập nhật chapter:", err);
      alert("❌ Lỗi kết nối!");
    }
  }

  return (
    <div className="dangtruyen-page" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f5f5f5", color: "#222222", padding: "0 1rem 1.5rem" }}>
      {/* NAVBAR */}
      <nav className="dangtruyen-topnav">
        <button className={location.pathname === "/dang-truyen" ? "active" : ""} onClick={() => navigate("/dang-truyen")}>Thêm Truyện mới</button>
        <button className={location.pathname === "/quan-ly-truyen" ? "active" : ""} onClick={() => navigate("/quan-ly-truyen")}>Q.Lý truyện</button>
        <button>Q.Lý Convert</button>
        <button>Q.Lý Sáng tác</button>
        <button>Q.Lý Trang</button>
        <button>Tiện ích</button>
      </nav>

      {/* MAIN LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.5rem", padding: "1.5rem", flex: 1, maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        {/* LEFT SIDEBAR - DANH SÁCH TRUYỆN CỦA TÔI */}
        <div style={{ background: "#1a1d23", border: "1px solid #242b36", borderRadius: "0.75rem", padding: "1rem", height: "fit-content", position: "sticky", top: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "#e2e8f0", borderBottom: "1px solid #242b36", paddingBottom: "0.75rem" }}>📚 Truyện Của Tôi</h3>
          
          {loading ? (
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", padding: "0.75rem 0", textAlign: "center" }}>Đang tải danh sách...</p>
          ) : Array.isArray(novels) && novels.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {novels.map((n) => (
                <div
                  key={n.idln}
                  style={{
                    padding: "0.75rem 1rem",
                    background: selectedNovel?.idln === n.idln ? "#2563eb" : "#242b36",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    borderLeft: selectedNovel?.idln === n.idln ? "3px solid #60a5fa" : "3px solid transparent",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "0.95rem"
                  }}
                  onClick={() => openNovel(n)}
                >
                  {n.title}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", padding: "0.75rem 0", textAlign: "center" }}>Bạn chưa đăng bộ truyện nào.</p>
          )}
        </div>

        {/* RIGHT CONTENT - CHI TIẾT VOLUME & CHAPTER */}
        <div style={{ background: "#1a1d23", border: "1px solid #242b36", borderRadius: "0.75rem", padding: "1.5rem" }}>
          {!detail ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100px", color: "#94a3b8", fontSize: "1.1rem", textAlign: "center" }}>
              <p>📖 Chọn một truyện để quản lý tập và chương</p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "2px solid #242b36", flexWrap: "wrap", gap: "1rem" }}>
                <h2 style={{ margin: 0, fontSize: "1.8rem", color: "#e2e8f0", flex: 1, minWidth: "200px" }}>📖 {detail.title}</h2>
                
                {/* DROPDOWN MENU */}
                <div style={{ position: "relative" }}>
                  <button 
                    style={{ 
                      padding: "0.7rem 1.2rem", 
                      background: "#10b981", 
                      color: "#ffffff", 
                      border: "none", 
                      borderRadius: "0.5rem", 
                      cursor: "pointer", 
                      fontWeight: "500", 
                      fontSize: "0.9rem" 
                    }} 
                    onClick={() => setShowVolumeMenu(!showVolumeMenu)}
                  >
                    ⚙️ Chức năng
                  </button>
                  
                  {showVolumeMenu && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      background: "#242b36",
                      border: "1px solid #3a4250",
                      borderRadius: "0.5rem",
                      minWidth: "200px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                      zIndex: 100,
                      marginTop: "0.5rem"
                    }}>
                      <button 
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "0.75rem 1rem",
                          background: "transparent",
                          border: "none",
                          color: "#e2e8f0",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          borderBottom: "1px solid #3a4250",
                          transition: "all 0.2s ease"
                        }}
                        onMouseOver={(e) => e.target.style.background = "#2563eb"}
                        onMouseOut={(e) => e.target.style.background = "transparent"}
                        onClick={() => createVolume(detail.idln)}
                      >
                        ➕ Thêm Volume
                      </button>
                      
                      <button 
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "0.75rem 1rem",
                          background: "transparent",
                          border: "none",
                          color: "#e2e8f0",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          borderBottom: "1px solid #3a4250",
                          transition: "all 0.2s ease"
                        }}
                        onMouseOver={(e) => e.target.style.background = "#d97706"}
                        onMouseOut={(e) => e.target.style.background = "transparent"}
                        onClick={() => {
                          if (detail.volumes?.length > 0) {
                            setSelectedVolumeForDelete(detail.volumes[0]?.volume_id);
                            setShowVolumeMenu(false);
                          } else {
                            alert("❌ Không có volume nào để xóa!");
                            setShowVolumeMenu(false);
                          }
                        }}
                      >
                        🗑️ Xóa Volume
                      </button>

                      <button 
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "0.75rem 1rem",
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          transition: "all 0.2s ease"
                        }}
                        onMouseOver={(e) => e.target.style.background = "#dc2626"}
                        onMouseOut={(e) => e.target.style.background = "transparent"}
                        onClick={() => {
                          deleteNovel();
                        }}
                      >
                        ⚠️ Xóa Truyện
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* MODAL XÓA VOLUME */}
              {selectedVolumeForDelete && (
                <div style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0, 0, 0, 0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2000,
                  padding: "1rem"
                }} onClick={() => setSelectedVolumeForDelete(null)}>
                  <div style={{
                    background: "#1a1d23",
                    border: "1px solid #242b36",
                    borderRadius: "1rem",
                    maxWidth: "400px",
                    width: "100%",
                    padding: "2rem",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)"
                  }} onClick={e => e.stopPropagation()}>
                    <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem", color: "#ef4444" }}>⚠️ Xóa Volume</h3>
                    <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>Chọn volume bạn muốn xóa:</p>
                    
                    <select 
                      value={selectedVolumeForDelete}
                      onChange={(e) => setSelectedVolumeForDelete(Number(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        background: "#242b36",
                        border: "1px solid #3a4250",
                        borderRadius: "0.5rem",
                        color: "#e2e8f0",
                        fontSize: "0.9rem",
                        marginBottom: "1.5rem",
                        boxSizing: "border-box",
                        cursor: "pointer"
                      }}
                    >
                      {detail.volumes?.map(vol => (
                        <option key={vol.volume_id} value={vol.volume_id}>
                          {vol.title || `Volume ${vol.volume_number}`}
                        </option>
                      ))}
                    </select>

                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                      <button 
                        style={{
                          padding: "0.6rem 1rem",
                          background: "#6b7280",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                          fontWeight: "500"
                        }}
                        onClick={() => setSelectedVolumeForDelete(null)}
                      >
                        Hủy
                      </button>
                      <button 
                        style={{
                          padding: "0.6rem 1rem",
                          background: "#ef4444",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                          fontWeight: "500"
                        }}
                        onClick={() => {
                          deleteVolume(selectedVolumeForDelete);
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VOLUME LIST */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {(!detail.volumes || detail.volumes.length === 0) ? (
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem", padding: "1rem", textAlign: "center" }}>Chưa có volume nào. Bấm nút trên để tạo volume đầu tiên.</p>
                ) : (
                  detail.volumes.map((vol) => (
                    <div key={vol.volume_id} style={{ background: "#242b36", border: "1px solid #3a4250", borderRadius: "0.75rem", padding: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                        <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#e2e8f0", flex: 1, minWidth: "150px" }}>📦 {vol.title || `Volume ${vol.volume_number}`}</h3>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button 
                            style={{ padding: "0.5rem 0.8rem", background: "#10b981", color: "#ffffff", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: "500" }}
                            onClick={() => createChapter(vol.volume_id)}
                            title="Thêm chapter mới vào volume này"
                          >
                            ➕ Chapter
                          </button>
                        </div>
                      </div>

                      {/* CHAPTER LIST */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "400px", overflowY: "auto", paddingLeft: "1rem" }}>
                        {(!vol.chapters || vol.chapters.length === 0) ? (
                          <p style={{ color: "#94a3b8", fontSize: "0.9rem", padding: "1rem", textAlign: "center" }}>Chưa có chapter nào</p>
                        ) : (
                          vol.chapters.map((ch, idx) => {
                            const currentChapterId = ch.chapter_id || ch.id;
                            const uniqueChapterKey = currentChapterId ? `ch-${currentChapterId}` : `vol-${vol.volume_id}-idx-${idx}`;

                            return (
                              <div 
                                key={uniqueChapterKey}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.75rem",
                                  padding: "0.75rem 1rem",
                                  background: selectedChapter === currentChapterId ? "#2563eb" : "#1a1d23",
                                  border: selectedChapter === currentChapterId ? "1px solid #60a5fa" : "1px solid #3a4250",
                                  borderRadius: "0.5rem",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  borderLeft: selectedChapter === currentChapterId ? "3px solid #93c5fd" : "3px solid transparent"
                                }}
                              >
                                <span style={{ fontSize: "1rem", flexShrink: 0 }} onClick={() => openEditChapter(ch)}>📄</span>
                                <span 
                                  style={{ flex: 1, color: selectedChapter === currentChapterId ? "#ffffff" : "#c7d0db", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}
                                  onClick={() => openEditChapter(ch)}
                                  title="Bấm để chỉnh sửa"
                                >
                                  {ch.title}
                                </span>
                                <span style={{ color: selectedChapter === currentChapterId ? "#dbeafe" : "#94a3b8", fontSize: "0.85rem", flexShrink: 0 }}>#{ch.chapter_number}</span>
                                <span style={{ color: selectedChapter === currentChapterId ? "#cbd5e1" : "#94a3b8", fontSize: "0.85rem", flexShrink: 0, minWidth: "90px", textAlign: "right" }}>
                                  {formatDate(ch.created_at)}
                                </span>
                                <button
                                  style={{
                                    padding: "0.3rem 0.6rem",
                                    background: "#ef4444",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "0.3rem",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    fontWeight: "500",
                                    flexShrink: 0
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChapter(currentChapterId);
                                  }}
                                  title="Xóa chapter"
                                >
                                  🗑️
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* EDIT CHAPTER MODAL */}
      {isEditModalOpen && editingChapter && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }} onClick={() => setIsEditModalOpen(false)}>
          <div style={{ background: "#1a1d23", border: "1px solid #242b36", borderRadius: "1rem", maxWidth: "800px", width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", borderBottom: "1px solid #242b36" }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#e2e8f0" }}>✏️ Chỉnh sửa Chapter</h2>
              <button style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.5rem", cursor: "pointer", padding: "0.25rem 0.5rem" }} onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>

            <div style={{ padding: "1.5rem", flex: 1, overflowY: "auto" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", color: "#e2e8f0", fontWeight: "500", marginBottom: "0.5rem", fontSize: "0.95rem" }}>Tiêu đề Chapter:</label>
                <input
                  type="text"
                  value={editingChapter.title || ""}
                  onChange={(e) => setEditingChapter({...editingChapter, title: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem 1rem", background: "#242b36", border: "1px solid #3a4250", borderRadius: "0.5rem", color: "#e2e8f0", fontSize: "0.95rem", fontFamily: "inherit", boxSizing: "border-box" }}
                  placeholder="Nhập tiêu đề chapter"
                />
              </div>

              <div style={{ marginBottom: 0 }}>
                <label style={{ display: "block", color: "#e2e8f0", fontWeight: "500", marginBottom: "0.5rem", fontSize: "0.95rem" }}>Nội dung:</label>
                <textarea
                  value={editingChapter.content || ""}
                  onChange={(e) => setEditingChapter({...editingChapter, content: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem 1rem", background: "#242b36", border: "1px solid #3a4250", borderRadius: "0.5rem", color: "#e2e8f0", fontSize: "0.95rem", fontFamily: "inherit", boxSizing: "border-box", resize: "vertical", minHeight: "200px" }}
                  placeholder="Nhập nội dung chapter"
                  rows="15"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", padding: "1.5rem", borderTop: "1px solid #242b36", justifyContent: "flex-end" }}>
              <button style={{ padding: "0.6rem 1rem", background: "#6b7280", color: "#ffffff", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "500" }} onClick={() => setIsEditModalOpen(false)}>
                Hủy
              </button>
              <button style={{ padding: "0.6rem 1.5rem", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "500" }} onClick={updateChapter}>
                Lưu lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}