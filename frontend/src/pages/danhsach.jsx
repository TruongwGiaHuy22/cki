import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useNovels } from "../hooks/useNovels";

export default function DanhSach() {
  const { novels, loading, error } = useNovels();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("latest");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const [appliedTypes, setAppliedTypes] = useState([]);
  const [appliedStatus, setAppliedStatus] = useState([]);

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 18;
  
  const setCurrentPage = (page) => {
    setSearchParams({ page: page.toString() });
  };

  const genres = [
    "Action", "Adapted to Anime", "Adapted to Drama CD", "Adapted to Manga", "Adapted to Manhua", "Adapted to Manhwa",
    "Adult", "Adventure", "Age Gap", "Boys Love", "Character Growth", "Chinese Novel", "Comedy", "Cooking",
    "Different Social Status", "Drama", "Ecchi", "English Novel", "Fanfiction", "Fantasy", "Female Protagonist",
    "Game", "Gender Bender", "Harem", "Historical", "Horror", "Incest", "Isekai", "Josei", "Korean Novel", "Magic",
    "Martial Arts", "Mature", "Mecha", "Military", "Misunderstanding", "Mystery", "Netorare", "One shot", "Otome Game",
    "Parody", "Psychological", "Reverse Harem", "Romance", "Satire", "School Life", "Science Fiction", "Seinen",
    "Shoujo", "Shoujo ai", "Shounen", "Shounen ai", "Slice of Life", "Slow Life", "Sports", "Super Power", "Supernatural",
    "Suspense", "Tragedy", "Wars", "Web Novel", "Workplace", "Wuxia", "Xianxia", "Yandere", "Yuri"
  ];

  const TYPE_OPTIONS = [
    { label: "Truyện dịch", value: "Truyện dịch" },
    { label: "Truyện sáng tác", value: "Sáng tác" },
    { label: "Truyện AI dịch", value: "AI" },
  ];

  const STATUS_OPTIONS = [
    { label: "Đang tiến hành", value: "Đang tiến hành" },
    { label: "Tạm ngưng", value: "Tạm ngưng" },
    { label: "Đã hoàn thành", value: "Hoàn thành" },
  ];

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((item) => item !== genre) : [...prev, genre]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const toggleStatus = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((item) => item !== status) : [...prev, status]
    );
  };

  const handleApplyFilter = () => {
    setAppliedTypes(selectedTypes);
    setAppliedStatus(selectedStatus);
    setCurrentPage(1);
  };
  const handleResetToDefault = () => {
    setSelectedLetter("ALL");
    setSortOrder("latest");
    setSelectedGenres([]);
    setSelectedTypes([]);
    setSelectedStatus([]);
    setAppliedTypes([]);
    setAppliedStatus([]);
    setCurrentPage(1);
  };

  const filteredNovels = useMemo(() => {
    const normalize = (v) => String(v || "").trim().toLowerCase();
    const result = novels.filter((novel) => {
      const matchType =
        appliedTypes.length === 0 ||
        appliedTypes.some((t) => normalize(novel.type).includes(normalize(t)));
      const matchStatus =
        appliedStatus.length === 0 ||
        appliedStatus.some((s) => normalize(novel.status).includes(normalize(s)));
      const matchGenre =
        selectedGenres.length === 0 ||
        selectedGenres.some((genre) => Array.isArray(novel.genres) && novel.genres.includes(genre));
      const firstChar = (novel.title || "").trim().charAt(0).toUpperCase();
      const isAZ = firstChar >= "A" && firstChar <= "Z";
      const matchLetter =
        selectedLetter === "ALL" ||
        (selectedLetter === "#" ? !isAZ : firstChar === selectedLetter);

      return matchType && matchStatus && matchGenre && matchLetter;
    });

    if (sortOrder === "asc") {
      return [...result].sort((a, b) => (a.title || "").localeCompare(b.title || "", "vi"));
    }
    if (sortOrder === "desc") {
      return [...result].sort((a, b) => (b.title || "").localeCompare(a.title || "", "vi"));
    }
    return [...result].sort((a, b) => b.id - a.id);
  }, [novels, appliedTypes, appliedStatus, selectedGenres, selectedLetter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredNovels.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleNovels = filteredNovels.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="danhsach-page">Đang tải dữ liệu...</div>;
  if (error) return <div className="danhsach-page">Lỗi: {error}</div>;

  return (
    <div className="danhsach-page">
      <div className="danhsach-toolbar">
        <div>
          <div className="home-section-tags">
            <span className="home-section-tag active">Danh sách truyện</span>
          </div>
        </div>
        <select
          className="danhsach-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="latest">Mới cập nhật</option>
          <option value="asc">A - Z</option>
          <option value="desc">Z - A</option>
        </select>
      </div>

      <div className="danhsach-layout">
        <section className="danhsach-content">
          <div className="danhsach-grid">
            {visibleNovels.map((novel) => (
              <Link key={novel.id} to={`/novel/${novel.id}`} className="home-card danhsach-card">
                <img src={novel.cover} alt={novel.title} className="home-card-img cover-img" />
                <div className="home-card-meta">
                  <p className="home-card-label">{novel.type}</p>
                  <h3>{novel.title}</h3>
                  <p>{Array.isArray(novel.genres) ? novel.genres.join(", ") : ""}</p>
                  <span className="danhsach-status">{novel.status}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="danhsach-pagination">
            <button
              type="button"
              className="danhsach-page-btn danhsach-page-edge"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              Đầu
            </button>

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

            <button
              type="button"
              className="danhsach-page-btn danhsach-page-edge"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Cuối
            </button>
          </div>
        </section>

        <aside className="danhsach-sidebar">
          <div className="sidebar-panel">
            <h3 className="danhsach-box-title">Chữ cái</h3>
            <div className="danhsach-alpha-grid">
              <span
                className={selectedLetter === "ALL" ? "danhsach-alpha-active" : ""}
                onClick={handleResetToDefault}
              >
                TẤT CẢ
              </span>
              <span
                className={selectedLetter === "#" ? "danhsach-alpha-active" : ""}
                onClick={() => setSelectedLetter("#")}
              >
                #
              </span>
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((c) => (
                <span
                  key={c}
                  className={selectedLetter === c ? "danhsach-alpha-active" : ""}
                  onClick={() => setSelectedLetter(c)}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="sidebar-panel danhsach-filter-panel">
            <h3 className="danhsach-box-title">Phân loại</h3>
            {TYPE_OPTIONS.map((opt) => (
              <label className="danhsach-check" key={opt.value}>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(opt.value)}
                  onChange={() => toggleType(opt.value)}
                /> {opt.label}
              </label>
            ))}
            <button type="button" className="danhsach-apply-btn" onClick={handleApplyFilter}>Áp dụng</button>
          </div>

          <div className="sidebar-panel danhsach-filter-panel">
            <h3 className="danhsach-box-title">Tình trạng</h3>
            {STATUS_OPTIONS.map((opt) => (
              <label className="danhsach-check" key={opt.value}>
                <input
                  type="checkbox"
                  checked={selectedStatus.includes(opt.value)}
                  onChange={() => toggleStatus(opt.value)}
                /> {opt.label}
              </label>
            ))}
            <button type="button" className="danhsach-apply-btn" onClick={handleApplyFilter}>Áp dụng</button>
          </div>

          <div className="sidebar-panel">
            <h3 className="danhsach-box-title">Thể loại</h3>
            <div className="danhsach-genre-list">
              {genres.map((genre) => (
                <label
                  key={genre}
                  className={`danhsach-genre-item ${selectedGenres.includes(genre) ? "active" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
