import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NovelDetail() {
  const { id } = useParams();
  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/novels/${id}`)
      .then(res => res.json())
      .then(json => {
        setNovel(json.data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (!novel) return <div>Không tìm thấy truyện</div>;

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 24, background: "#fff" }}>
      <img src={novel.cover || "/favicon.svg"} alt={novel.title} style={{ width: 200, float: "left", marginRight: 24 }} />
      <h1>{novel.title}</h1>
      <p><b>Tác giả:</b> {novel.author}</p>
      <p><b>Họa sĩ:</b> {novel.authordraw}</p>
      <p><b>Trạng thái:</b> {novel.status}</p>
      <p><b>Mô tả:</b> {novel.description}</p>
      <p><b>Thể loại:</b> {novel.genres.join(", ")}</p>
      <div style={{ clear: "both" }} />
      <h2>Danh sách chương</h2>
      <ul>
        {novel.chapters.map(ch => (
          <li key={ch.id}>
            <Link to={`/chapter/${ch.id}`}>{ch.title}</Link>
          </li>
        ))}
      </ul>
      <Link to="/novels">← Quay lại danh sách truyện</Link>
    </div>
  );
}
