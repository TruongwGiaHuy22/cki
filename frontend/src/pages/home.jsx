import { Link } from "react-router-dom";
import { useNovels } from "../hooks/useNovels";
import { getImageUrl } from "../utils/imageUrl";
import { useEffect, useState } from "react";

export default function Home() {
  const { novels, loading, error } = useNovels();
  const [recentReads, setRecentReads] = useState([]);
  const [comments, setComments] = useState([]);
  const [topViewNovels, setTopViewNovels] = useState([]);

  // Lấy reading history của user
  useEffect(() => {
    const fetchReadingHistory = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        console.log('Token:', token ? 'exists' : 'missing');
        if (!token) {
          console.log('No token, skipping history fetch');
          setRecentReads([]);
          return;
        }
        console.log('Fetching reading history...');
        const res = await fetch('http://localhost:4000/api/history', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log('History response status:', res.status);
        const json = await res.json();
        console.log('History data:', json);
        if (json.success && json.data) {
          // Lấy 4 cuốn gần đây nhất
          console.log('Setting recent reads:', json.data.slice(0, 4));
          setRecentReads(json.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching reading history:', err);
        setRecentReads([]);
      }
    };
    fetchReadingHistory();
  }, []);

  // Lấy comments gần đây (3 cái mới nhất)
  useEffect(() => {
    const fetchRecentComments = async () => {
      try {
        console.log('Fetching recent comments...');
        const res = await fetch('http://localhost:4000/api/comments/recent?limit=3');
        console.log('Response status:', res.status);
        const json = await res.json();
        console.log('Comments data:', json);
        if (json.success && json.data) {
          setComments(json.data);
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
        setComments([]);
      }
    };
    fetchRecentComments();
  }, []);

  // Sắp xếp novels theo views cao nhất
  useEffect(() => {
    if (novels.length > 0) {
      const sorted = [...novels].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
      setTopViewNovels(sorted.slice(0, 10));
    }
  }, [novels]);

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
  const completedNovels = novels.filter(novel => (novel.status || "").toLowerCase().includes("completed")).slice(0, 8);

  if (loading) return <div className="p-4 home-page">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-4 home-page">Lỗi tải dữ liệu: {error}</div>;

  return (
    <div className="p-4 home-page">
      <section className="home-carousel-section mb-8"><div className="home-carousel" style={{gridTemplateColumns:`repeat(${Math.max(featured.length,1)}, minmax(0, 1fr))`,gap:"10px"}}>{featured.length>0?featured.map(novel=>(<Link key={novel.id} to={`/novel/${novel.id}`} className="carousel-slide"><img src={getImageUrl(novel.cover)} alt={novel.title} className="carousel-img cover-img" /><div className="carousel-overlay"><h2>{shortTitle(novel.title)}</h2><p>{shortGenres(novel.genres)}</p><p>{novel.status || "Đang cập nhật"}</p></div></Link>)):(<div className="carousel-slide carousel-placeholder"><p>Chưa có truyện nổi bật</p></div>)}</div></section>
      <section className="home-grid-section mb-8"><div className="home-section-header"><div className="home-section-tags"><span className="home-section-tag active">📚 Truyện dịch mới nhất</span></div></div><div className="home-card-grid-fullwidth">{dichNovels.map(novel => (<Link key={novel.id} to={`/novel/${novel.id}`} className="home-card"><img src={getImageUrl(novel.cover)} alt={novel.title} className="home-card-img cover-img" /><div className="home-card-meta"><p className="home-card-label">{novel.status}</p><h3>{novel.title}</h3><p>{(novel.genres||[]).join(", ")}</p></div></Link>))}</div><div className="home-section-footer"><Link to="/danhsach" className="view-more">Xem thêm →</Link></div></section>
      <section className="home-grid-section mb-8"><div className="home-section-header"><div className="home-section-tags"><span className="home-section-tag active">✏️ Sáng tác mới nhất</span></div></div><div className="home-card-grid-fullwidth">{sangTacNovels.map(novel => (<Link key={novel.id} to={`/novel/${novel.id}`} className="home-card"><img src={getImageUrl(novel.cover)} alt={novel.title} className="home-card-img cover-img" /><div className="home-card-meta"><p className="home-card-label">{novel.status}</p><h3>{novel.title}</h3><p>{(novel.genres||[]).join(", ")}</p></div></Link>))}</div><div className="home-section-footer"><Link to="/sangtac" className="view-more">Xem thêm →</Link></div></section>
      <section className="home-grid-section mb-8"><div className="home-section-header"><div className="home-section-tags"><span className="home-section-tag active">🤖 AI dịch mới nhất</span></div></div><div className="home-card-grid-fullwidth">{aiNovels.map(novel => (<Link key={novel.id} to={`/novel/${novel.id}`} className="home-card"><img src={getImageUrl(novel.cover)} alt={novel.title} className="home-card-img cover-img" /><div className="home-card-meta"><p className="home-card-label">{novel.status}</p><h3>{novel.title}</h3><p>{(novel.genres||[]).join(", ")}</p></div></Link>))}</div><div className="home-section-footer"><Link to="/ai" className="view-more">Xem thêm →</Link></div></section>
      <aside className="home-sidebar"><div className="sidebar-panel"><div className="sidebar-header"><div className="sidebar-tags"><span className="sidebar-tag active">📖 VỪA ĐỌC</span></div></div><ul className="sidebar-list">{recentReads.length > 0 ? recentReads.map(item => {
        const novelId = item.idln || item.id;
        const novelTitle = item.title;
        const novelCover = getImageUrl(item.cover);
        return (
          <li key={novelId} className="sidebar-item">
            <img src={novelCover} alt={novelTitle} className="sidebar-thumb" />
            <div className="sidebar-content">
              <Link to={`/novel/${novelId}`} style={{textDecoration: 'none', color: 'inherit'}}>
                <h4>{novelTitle}</h4>
              </Link>
              <small>Vừa đọc</small>
            </div>
          </li>
        );
      }) : <li style={{padding: '10px', textAlign: 'center', color: '#999', gridColumn: '1 / -1'}}>Chưa đọc truyện nào</li>}</ul></div><div className="sidebar-panel"><div className="sidebar-header"><div className="sidebar-tags"><span className="sidebar-tag active">⭐ TOP VIEWS</span></div></div><ol className="sidebar-ranking">{topViewNovels.map((novel, idx) => (<li key={novel.id}><span className="ranking-number">{idx + 1}</span><span className="ranking-title">{(novel.title || "").substring(0, 25)}...</span><span style={{fontSize: '0.8rem', color: '#999', marginLeft: 'auto'}}>{(novel.view_count || 0).toLocaleString()} views</span></li>))}</ol></div><div className="sidebar-panel"><div className="sidebar-header"><div className="sidebar-tags"><span className="sidebar-tag active">💬 Bình luận gần đây</span></div></div><div className="comments-box">{comments.length === 0 ? <div style={{padding: '10px', textAlign: 'center', color: '#999'}}>Chưa có bình luận.</div> : comments.map(comment => {
        const date = new Date(comment.created_at);
        const timeStr = date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
        return (
          <div key={comment.id} className="comment-item" style={{padding: '10px', borderBottom: '1px solid #333'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
              <strong style={{color: '#fbbf24'}}>{comment.user_name || 'Ẩn danh'}</strong>
              <small style={{color: '#666', fontSize: '0.75rem'}}>{timeStr}</small>
            </div>
            <p style={{margin: '5px 0', color: '#ccc', fontSize: '0.9rem'}}>{comment.content}</p>
            <small style={{color: '#666', fontSize: '0.8rem'}}>Truyện: {comment.novel_title}</small>
          </div>
        );
      })}</div></div></aside>
    </div>
  );
}
