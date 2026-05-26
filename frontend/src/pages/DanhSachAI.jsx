import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useNovels } from "../hooks/useNovels";

export default function DanhSachAI() {
  const { novels, loading, error } = useNovels();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [appliedStatus, setAppliedStatus] = useState([]);
  const currentPage = Number(searchParams.get("page")) || 1;
  const setCurrentPage = (page) => {
    setSearchParams({ page: page.toString() });
  };

  const itemsPerPage = 13;
  const genres = ["Action","Adapted to Anime","Adapted to Drama CD","Adapted to Manga","Adapted to Manhua","Adapted to Manhwa","Adult","Adventure","Age Gap","Boys Love","Character Growth","Chinese Novel","Comedy","Cooking","Different Social Status","Drama","Ecchi","English Novel","Fanfiction","Fantasy","Female Protagonist","Game","Gender Bender","Harem","Historical","Horror","Incest","Isekai","Josei","Korean Novel","Magic","Martial Arts","Mature","Mecha","Military","Misunderstanding","Mystery","Netorare","One shot","Otome Game","Parody","Psychological","Reverse Harem","Romance","Satire","School Life","Science Fiction","Seinen","Shoujo","Shoujo ai","Shounen","Shounen ai","Slice of Life","Slow Life","Sports","Super Power","Supernatural","Suspense","Tragedy","Wars","Web Novel","Workplace","Wuxia","Xianxia","Yandere","Yuri"];
  const STATUS_OPTIONS = ["Đang tiến hành", "Tạm ngưng", "Hoàn thành"];

  const toggleGenre = (genre) => {
    setSelectedGenres((c) => (c.includes(genre) ? c.filter((i) => i !== genre) : [...c, genre]));
    setCurrentPage(1);
  };
  const toggleStatus = (status) => setSelectedStatus((c) => (c.includes(status) ? c.filter((i) => i !== status) : [...c, status]));
  const handleApplyStatus = () => {
    setAppliedStatus(selectedStatus);
    setCurrentPage(1);
  };
  const handleResetToDefault = () => {
    setSelectedLetter("ALL");
    setSelectedGenres([]);
    setSelectedStatus([]);
    setAppliedStatus([]);
    setCurrentPage(1);
  };

  const baseAI = useMemo(() => novels.filter((n) => (n.type || "").trim() === "AI dịch"), [novels]);

  const filteredAI = useMemo(() => {
    const normalize = (v) => String(v || "").trim().toLowerCase();
    return baseAI
      .filter((n) => appliedStatus.length === 0 || appliedStatus.some((s) => normalize(n.status).includes(normalize(s))))
      .filter((n) => selectedGenres.length === 0 || selectedGenres.some((g) => Array.isArray(n.genres) && n.genres.includes(g)))
      .filter((n) => {
        if (selectedLetter === "ALL") return true;
        const firstChar = (n.title || "").trim().charAt(0).toUpperCase();
        const isAZ = firstChar >= "A" && firstChar <= "Z";
        return selectedLetter === "#" ? !isAZ : firstChar === selectedLetter;
      })
      .sort((a, b) => b.id - a.id);
  }, [appliedStatus, selectedGenres, selectedLetter, baseAI]);

  const totalPages = Math.max(1, Math.ceil(filteredAI.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleAI = filteredAI.slice(startIndex, startIndex + itemsPerPage);
  
  if (loading) return <div className="ai-container">Đang tải dữ liệu...</div>;
  if (error) return <div className="ai-container">Lỗi: {error}</div>;

  return (
    <div className="ai-container">
      <div className="ai-left">
        <h2 className="ai-title">Truyện AI mới cập nhật ({filteredAI.length})</h2>

        {visibleAI.map((novel) => {
          const hasChapters = novel.chapters && novel.chapters.length > 0;
          const lastChapterTitle = hasChapters ? novel.chapters[novel.chapters.length - 1].title : "Chưa có chương";
          return (
            <Link key={novel.id} to={`/novel/${novel.id}`} className="ai-card">
              <img src={novel.cover || "/default.jpg"} alt={novel.title} className="ai-img" />
              <div className="ai-content">
                <h3 className="ai-name">{novel.title}</h3>
                <p className="ai-meta">
                  <span className="meta-label">Người đăng</span>
                  <span className="author-name"> {novel.sangTacInfo?.author || "Ẩn danh"}</span>
                  <span className="meta-label"> &nbsp; Số từ </span>
                  <span className="word-count">{novel.sangTacInfo?.words || (hasChapters ? novel.chapters.length * 1000 : 0)}</span>
                </p>
                <p className="ai-desc">{novel.sangTacInfo?.description || novel.description}</p>
                <p className="ai-chapter-main">{novel.sangTacInfo?.chapterMain || lastChapterTitle}</p>
                <p className="ai-chapter-sub">{novel.sangTacInfo?.chapterSub || (hasChapters ? "" : "Đang cập nhật nội dung...")}</p>
              </div>
            </Link>
          );
        })}

        <div className="danhsach-pagination">
          <button type="button" className="danhsach-page-btn danhsach-page-edge" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>Đầu</button>
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                type="button"
                className={`danhsach-page-btn danhsach-page-number ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}
          <button type="button" className="danhsach-page-btn danhsach-page-edge" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Cuối</button>
        </div>
      </div>

      <aside className="ai-sidebar">
        <div className="sidebar-panel">
          <h3 className="ai-box-title">Chữ cái</h3>
          <div className="ai-alpha-grid">
            <span className={selectedLetter === "ALL" ? "ai-alpha-active" : ""} onClick={handleResetToDefault}>TẤT CẢ</span>
            <span className={selectedLetter === "#" ? "ai-alpha-active" : ""} onClick={() => { setSelectedLetter("#"); setCurrentPage(1); }}>#</span>
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((c) => (
              <span key={c} className={selectedLetter === c ? "ai-alpha-active" : ""} onClick={() => { setSelectedLetter(c); setCurrentPage(1); }}>{c}</span>
            ))}
          </div>
        </div>

        <div className="sidebar-panel ai-filter-panel">
          <h3 className="ai-box-title">Tình trạng</h3>
          {STATUS_OPTIONS.map((status) => (
            <label className="ai-check" key={status}>
              <input type="checkbox" checked={selectedStatus.includes(status)} onChange={() => toggleStatus(status)} /> {status === "Hoàn thành" ? "Đã hoàn thành" : status}
            </label>
          ))}
          <button type="button" className="ai-apply-btn" onClick={handleApplyStatus}>Áp dụng</button>
        </div>

        <div className="sidebar-panel">
          <h3 className="ai-box-title">Thể loại</h3>
          <div className="ai-genre-list">
            {genres.map((genre) => (
              <label key={genre} className={`ai-genre-item ${selectedGenres.includes(genre) ? "active" : ""}`}>
                <input type="checkbox" checked={selectedGenres.includes(genre)} onChange={() => toggleGenre(genre)} />
                <span>{genre}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
