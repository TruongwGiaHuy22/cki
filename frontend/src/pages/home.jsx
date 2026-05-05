import { novels } from "../data/novel.js";
import { Link } from "react-router-dom";

export default function Home() {
  const featured = novels.filter(novel => novel.featured).slice(0, 8);
  const dichNovels = novels.filter(novel => novel.type === "Truyện dịch").slice(0, 8);
  const sangTacNovels = novels.filter(novel => novel.type === "Sáng tác").slice(0, 8);
  const aiNovels = novels.filter(novel => novel.type === "AI").slice(0, 8);
  const topWeekNovels = novels.filter(novel => novel.top === "week").slice(0, 5);
  const topMonthNovels = novels.filter(novel => novel.top === "month").slice(0, 5);
  const recentReads = novels.slice(0, 4);
  const completedNovels = novels.filter(novel => novel.status === "Hoàn thành").slice(0, 8);
  const comments = [
    { id: 1, user: "NguyenA", text: "Truyện hay quá! Nhân vật phát triển rất tự nhiên, cốt truyện twists bất ngờ.", time: "2 giờ trước" },
    { id: 2, user: "TranB", text: "Đợi chap mới mãi không thấy! Tác giả update nhanh lên đi, mình đang nghiện.", time: "1 ngày trước" },
    { id: 3, user: "LeC", text: "Nhân vật chính mạnh mẽ, thế giới quan rộng lớn. Đây là một trong những light novel hay nhất mình từng đọc.", time: "3 ngày trước" },
    { id: 4, user: "PhamD", text: "Art đẹp, story line logic, không có plot hole. Recommend cho mọi người!", time: "5 ngày trước" },
    { id: 5, user: "HoangE", text: "Đọc xong cảm thấy thỏa mãn, ending happy. Mong có phần tiếp theo.", time: "1 tuần trước" },
    { id: 6, user: "VuF", text: "Từ đầu đến cuối đều hấp dẫn, không chán. Tác giả tài năng!", time: "2 tuần trước" },
  ];

  return (
    <div className="p-4 home-page">
      <section className="home-carousel-section mb-8">
        <div
          className="home-carousel"
          style={{ 
    gridTemplateColumns: `repeat(${Math.max(featured.length, 1)}, minmax(0, 1fr))`,
    gap: "10px" 
  }}
        >
          {featured.length > 0 ? (
            featured.map(novel => (
              <div key={novel.id} className="carousel-slide">
                <img src={novel.cover} alt={novel.title} className="carousel-img cover-img" />
                <div className="carousel-overlay">
                  <h2>{novel.title}</h2>
                  <p>{novel.genres.slice(0, 3).join(", ")}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="carousel-slide carousel-placeholder">
              <p>Chưa có truyện nổi bật</p>
            </div>
          )}
        </div>
      </section>

      {/* Truyện dịch - Full Width */}
      <section className="home-grid-section mb-8">
        <div className="home-section-header">
          <div className="home-section-tags">
            <span className="home-section-tag active">📚 Truyện dịch mới nhất</span>
          </div>
        </div>
        <div className="home-card-grid-fullwidth">
          {dichNovels.map(novel => (
            <article key={novel.id} className="home-card">
              <img src={novel.cover} alt={novel.title} className="home-card-img cover-img" />
              <div className="home-card-meta">
                <p className="home-card-label">{novel.status}</p>
                <h3>{novel.title}</h3>
                <p>{novel.genres.join(", ")}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="home-section-footer">
          <Link to="/danhsach" className="view-more">Xem thêm →</Link>
        </div>
      </section>

      {/* Sáng tác - Full Width */}
      <section className="home-grid-section mb-8">
        <div className="home-section-header">
          <div className="home-section-tags">
            <span className="home-section-tag active">✏️ Sáng tác mới nhất</span>
          </div>
        </div>
        <div className="home-card-grid-fullwidth">
          {sangTacNovels.map(novel => (
            <article key={novel.id} className="home-card">
              <img src={novel.cover} alt={novel.title} className="home-card-img cover-img" />
              <div className="home-card-meta">
                <p className="home-card-label">{novel.status}</p>
                <h3>{novel.title}</h3>
                <p>{novel.genres.join(", ")}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="home-section-footer">
          <Link to="/sangtac" className="view-more">Xem thêm →</Link>
        </div>
      </section>

      {/* AI dịch - Full Width */}
      <section className="home-grid-section mb-8">
        <div className="home-section-header">
          <div className="home-section-tags">
            <span className="home-section-tag active">🤖 AI dịch mới nhất</span>
          </div>
        </div>
        <div className="home-card-grid-fullwidth">
          {aiNovels.map(novel => (
            <article key={novel.id} className="home-card">
              <img src={novel.cover} alt={novel.title} className="home-card-img cover-img" />
              <div className="home-card-meta">
                <p className="home-card-label">{novel.status}</p>
                <h3>{novel.title}</h3>
                <p>{novel.genres.join(", ")}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="home-section-footer">
          <Link to="/ai" className="view-more">Xem thêm →</Link>
        </div>
      </section>

      {/* Top tuần & Top tháng - 2 cột */}
      <div className="home-row home-row-2 mb-8">
        {/* Top tuần */}
        <section className="home-grid-section">
          <div className="home-section-header">
            <div className="home-section-tags">
              <span className="home-section-tag active">🏆 Top tuần</span>
            </div>
          </div>
          <div className="home-card-grid home-card-grid-3">
            {topWeekNovels.slice(0, 3).map(novel => (
              <article key={novel.id} className="home-card">
                <img src={novel.cover} alt={novel.title} className="home-card-img cover-img" />
                <div className="home-card-meta">
                  <p className="home-card-label">{novel.status}</p>
                  <h3>{novel.title}</h3>
                  <p>{novel.genres.join(", ")}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="home-section-footer">
            <Link to="/top-tuan" className="view-more">Xem thêm →</Link>
          </div>
        </section>

        {/* Top tháng giống Top tuần: chỉ hiện 3 truyện, nút Xem thêm ở dưới */}
        <section className="home-grid-section">
          <div className="home-section-header">
            <div className="home-section-tags">
              <span className="home-section-tag active">🏆 Top tháng</span>
            </div>
          </div>
          <div className="home-card-grid home-card-grid-3">
            {topMonthNovels.slice(0, 3).map(novel => (
              <article key={novel.id} className="home-card">
                <img src={novel.cover} alt={novel.title} className="home-card-img cover-img" />
                <div className="home-card-meta">
                  <p className="home-card-label">{novel.status}</p>
                  <h3>{novel.title}</h3>
                  <p>{novel.genres.join(", ")}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="home-section-footer">
            <Link to="/top-thang" className="view-more">Xem thêm →</Link>
          </div>
        </section>
      </div>

      {/* Truyện đã hoàn thành - Full Width */}
      <section className="home-grid-section mb-8">
        <div className="home-section-header">
          <div className="home-section-tags">
            <span className="home-section-tag active">✅ Truyện đã hoàn thành</span>
          </div>
        </div>
        <div className="home-card-grid-fullwidth">
          {completedNovels.map(novel => (
            <article key={novel.id} className="home-card">
              <img src={novel.cover} alt={novel.title} className="home-card-img cover-img" />
              <div className="home-card-meta">
                <p className="home-card-label">{novel.status}</p>
                <h3>{novel.title}</h3>
                <p>{novel.genres.join(", ")}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="home-section-footer">
          <Link to="/danhsach" className="view-more">Xem thêm →</Link>
        </div>
      </section>

      {/* Sidebar */}
      <aside className="home-sidebar">
        <div className="sidebar-panel">
          <div className="sidebar-header">
            <div className="sidebar-tags">
              <span className="sidebar-tag active">📖 VỪA ĐỌC</span>
            </div>
          </div>
          <ul className="sidebar-list">
            {recentReads.map(novel => (
              <li key={novel.id} className="sidebar-item">
                <img src={novel.cover} alt={novel.title} className="sidebar-thumb" />
                <div className="sidebar-content">
                  <h4>{novel.title}</h4>
                  <p className="sidebar-type">{novel.type}</p>
                  <small>Chương {novel.id}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-panel">
          <div className="sidebar-header">
            <div className="sidebar-tags">
              <span className="sidebar-tag active">⭐ TOP VIEWS</span>
            </div>
          </div>
          <ol className="sidebar-ranking">
            {novels.slice(0, 10).map((novel, idx) => (
              <li key={novel.id}>
                <span className="ranking-number">{idx + 1}</span>
                <span className="ranking-title">{novel.title.substring(0, 30)}...</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="sidebar-panel">
          <div className="sidebar-header">
            <div className="sidebar-tags">
              <span className="sidebar-tag active">💬 Bình luận gần đây</span>
            </div>
          </div>
          <div className="comments-box">
            {comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <strong>{comment.user}:</strong> {comment.text}
                <small className="comment-time"> - {comment.time}</small>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}



