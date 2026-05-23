import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Novels() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/novels")
      .then(res => res.json())
      .then(json => {
        setNovels(json.data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải danh sách truyện...</div>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
      {novels.map(novel => (
        <div key={novel.id} style={{ width: 220, border: "1px solid #eee", borderRadius: 8, padding: 12, background: "#fff" }}>
          <Link to={`/novel/${novel.id}`}>
            <img src={novel.cover || "/favicon.svg"} alt={novel.title} style={{ width: 200, height: 280, objectFit: "cover" }} />
            <h3>{novel.title}</h3>
          </Link>
          <div style={{ fontSize: 13, color: "#666" }}>{novel.author}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{novel.status}</div>
        </div>
      ))}
    </div>
  );
}
