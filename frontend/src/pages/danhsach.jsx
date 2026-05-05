import { useState } from "react";
import { novels } from "../data/novel.js";

export default function DanhSachPage() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  const genres = [
    "Action","Adapted to Anime","Adapted to Drama CD","Adapted to Manga","Adapted to Manhua","Adapted to Manhwa",
    "Adult","Adventure","Age Gap","Boys Love","Character Growth","Chinese Novel","Comedy","Cooking",
    "Different Social Status","Drama","Ecchi","English Novel","Fanfiction","Fantasy","Female Protagonist",
    "Game","Gender Bender","Harem","Historical","Horror","Incest","Isekai","Josei","Korean Novel","Magic",
    "Martial Arts","Mature","Mecha","Military","Misunderstanding","Mystery","Netorare","One shot","Otome Game",
    "Parody","Psychological","Reverse Harem","Romance","Satire","School Life","Science Fiction","Seinen",
    "Shoujo","Shoujo ai","Shounen","Shounen ai","Slice of Life","Slow Life","Sports","Super Power","Supernatural",
    "Suspense","Tragedy","Wars","Web Novel","Workplace","Wuxia","Xianxia","Yandere","Yuri"
  ];

  const toggleGenre = (genre) => {
    setSelectedGenres((current) =>
      current.includes(genre)
        ? current.filter((item) => item !== genre)
        : [...current, genre]
    );
  };

  const totalPages = Math.max(5, Math.ceil(novels.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pagedNovels = Array.from({ length: totalPages * itemsPerPage }, (_, index) => novels[index % novels.length]);
  const visibleNovels = pagedNovels.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="danhsach-page">
      <div className="danhsach-toolbar">
        <div>
          <div className="home-section-tags">
            <span className="home-section-tag active">Danh sách truyện</span>
          </div>
        </div>
        <select className="danhsach-select">
          <option>Mới cập nhật</option>
          <option>A - Z</option>
          <option>Z - A</option>
        </select>
      </div>

      <div className="danhsach-layout">
        <section className="danhsach-content">
          <div className="danhsach-grid">
            {visibleNovels.map((novel) => (
              <article key={novel.id} className="home-card danhsach-card">
                <img src={novel.cover} alt={novel.title} className="home-card-img cover-img" />
                <div className="home-card-meta">
                  <p className="home-card-label">{novel.type}</p>
                  <h3>{novel.title}</h3>
                  <p>{novel.genres.join(", ")}</p>
                  <span className="danhsach-status">{novel.status}</span>
                </div>
              </article>
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
              <span className="danhsach-alpha-active">TẤT CẢ</span>
              <span>#</span>
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>

          <div className="sidebar-panel danhsach-filter-panel">
            <h3 className="danhsach-box-title">Phân loại</h3>
            <label className="danhsach-check"><input type="checkbox" defaultChecked /> Truyện dịch</label>
            <label className="danhsach-check"><input type="checkbox" /> Truyện sáng tác</label>
            <label className="danhsach-check"><input type="checkbox" /> Truyện AI dịch</label>
            <button className="danhsach-apply-btn">Áp dụng</button>
          </div>

          <div className="sidebar-panel danhsach-filter-panel">
            <h3 className="danhsach-box-title">Tình trạng</h3>
            <label className="danhsach-check"><input type="checkbox" defaultChecked /> Đang tiến hành</label>
            <label className="danhsach-check"><input type="checkbox" defaultChecked /> Tạm ngưng</label>
            <label className="danhsach-check"><input type="checkbox" defaultChecked /> Đã hoàn thành</label>
            <button className="danhsach-apply-btn">Áp dụng</button>
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

};