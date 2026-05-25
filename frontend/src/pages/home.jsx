import { Link } from "react-router-dom";
import { useNovels } from "../hooks/useNovels";

export default function Home() {
  const { novels, loading, error } = useNovels();
  const shortTitle = (title) => {
    const words = String(title || "").trim().split(/\s+/).filter(Boolean);
    if (words.length <= 3) return words.join(" ");
    return `${words.slice(0, 3).join(" ")}...`;
  };
  const shortGenres = (genres) => (Array.isArray(genres) ? genres.slice(0, 2).join(", ") : "");

  const byNewest = [...novels].sort((a, b) => Number(b.id) - Number(a.id));
  const featured = byNewest.slice(0, 8);
  const dichNovels = byNewest.filter((n) => (n.type || "").toLowerCase().includes("dịch") && !(n.type || "").toLowerCase().includes("ai")).slice(0, 8);
  const sangTacNovels = byNewest.filter((n) => (n.type || "").toLowerCase().includes("sáng tác")).slice(0, 8);
  const aiNovels = byNewest.filter((n) => (n.type || "").toLowerCase().includes("ai")).slice(0, 8);
  const topWeekNovels = novels.slice(0, 5);
  const topMonthNovels = novels.slice(0, 5);
  const recentReads = novels.slice(0, 4);
  const completedNovels = novels.filter(novel => (novel.status || "").toLowerCase().includes("completed")).slice(0, 8);
  const comments = [];

  if (loading) return <div className="p-4 home-page">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-4 home-page">Lỗi tải dữ liệu: {error}</div>;

  return (
    <div className="p-4 home-page">
      <section className="home-carousel-section mb-8"><div className="home-carousel" style={{gridTemplateColumns:`repeat(${Math.max(featured.length,1)}, minmax(0, 1fr))`,gap:"10px"}}>{featured.length>0?featured.map(novel=>(<Link key={novel.id} to={`/novel/${novel.id}`} className="carousel-slide"><img src={novel.cover} alt={novel.title} className="carousel-img cover-img" /><div className="carousel-overlay"><h2>{shortTitle(novel.title)}</h2><p>{shortGenres(novel.genres)}</p><p>{novel.status || "Đang cập nhật"}</p></div></Link>)):(<div className="carousel-slide carousel-placeholder"><p>Chưa có truyện nổi bật</p></div>)}</div></section>
      <section className="home-grid-section mb-8"><div className="home-section-header"><div className="home-section-tags"><span className="home-section-tag active">📚 Truyện dịch mới nhất</span></div></div><div className="home-card-grid-fullwidth">{dichNovels.map(novel => (<Link key={novel.id} to={`/novel/${novel.id}`} className="home-card"><img src={novel.cover} alt={novel.title} className="home-card-img cover-img" /><div className="home-card-meta"><p className="home-card-label">{novel.status}</p><h3>{novel.title}</h3><p>{(novel.genres||[]).join(", ")}</p></div></Link>))}</div><div className="home-section-footer"><Link to="/danhsach" className="view-more">Xem thêm →</Link></div></section>
      <section className="home-grid-section mb-8"><div className="home-section-header"><div className="home-section-tags"><span className="home-section-tag active">✏️ Sáng tác mới nhất</span></div></div><div className="home-card-grid-fullwidth">{sangTacNovels.map(novel => (<Link key={novel.id} to={`/novel/${novel.id}`} className="home-card"><img src={novel.cover} alt={novel.title} className="home-card-img cover-img" /><div className="home-card-meta"><p className="home-card-label">{novel.status}</p><h3>{novel.title}</h3><p>{(novel.genres||[]).join(", ")}</p></div></Link>))}</div><div className="home-section-footer"><Link to="/sangtac" className="view-more">Xem thêm →</Link></div></section>
      <section className="home-grid-section mb-8"><div className="home-section-header"><div className="home-section-tags"><span className="home-section-tag active">🤖 AI dịch mới nhất</span></div></div><div className="home-card-grid-fullwidth">{aiNovels.map(novel => (<Link key={novel.id} to={`/novel/${novel.id}`} className="home-card"><img src={novel.cover} alt={novel.title} className="home-card-img cover-img" /><div className="home-card-meta"><p className="home-card-label">{novel.status}</p><h3>{novel.title}</h3><p>{(novel.genres||[]).join(", ")}</p></div></Link>))}</div><div className="home-section-footer"><Link to="/ai" className="view-more">Xem thêm →</Link></div></section>
      <aside className="home-sidebar"><div className="sidebar-panel"><div className="sidebar-header"><div className="sidebar-tags"><span className="sidebar-tag active">📖 VỪA ĐỌC</span></div></div><ul className="sidebar-list">{recentReads.map(novel => (<li key={novel.id} className="sidebar-item"><img src={novel.cover} alt={novel.title} className="sidebar-thumb" /><div className="sidebar-content"><h4>{novel.title}</h4><small>ID {novel.id}</small></div></li>))}</ul></div><div className="sidebar-panel"><div className="sidebar-header"><div className="sidebar-tags"><span className="sidebar-tag active">⭐ TOP VIEWS</span></div></div><ol className="sidebar-ranking">{novels.slice(0, 10).map((novel, idx) => (<li key={novel.id}><span className="ranking-number">{idx + 1}</span><span className="ranking-title">{(novel.title || "").substring(0, 30)}...</span></li>))}</ol></div><div className="sidebar-panel"><div className="sidebar-header"><div className="sidebar-tags"><span className="sidebar-tag active">💬 Bình luận gần đây</span></div></div><div className="comments-box">{comments.length===0?<div>Chưa có bình luận.</div>:comments.map(comment => (<div key={comment.id} className="comment-item"><strong>{comment.user}:</strong> {comment.text}<small className="comment-time"> - {comment.time}</small></div>))}</div></div></aside>
    </div>
  );
}
