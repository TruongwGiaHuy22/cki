import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ChapterList from "../compoment/chapterlist.jsx";
import { useNovels } from "../hooks/useNovels";

const API_BASE = "http://localhost:4000";
const assets = import.meta.glob("../assets/*.{png,jpg,jpeg,webp,svg}", { eager: true });
const assetByName = Object.fromEntries(
  Object.entries(assets).map(([p, mod]) => [p.split("/").pop().toLowerCase(), mod.default])
);

function resolveCover(cover) {
  if (!cover) return assetByName["noname29.png"];
  const raw = String(cover).trim();
  if (!raw) return assetByName["noname29.png"];
  if (raw.startsWith("http")) return raw;
  const file = raw.replace(/^\/+/, "").toLowerCase();
  if (assetByName[file]) return assetByName[file];
  const base = file.replace(/\.[^.]+$/, "");
  const candidate = Object.keys(assetByName).find((name) => name.replace(/\.[^.]+$/, "") === base);
  return candidate ? assetByName[candidate] : assetByName["noname29.png"];
}

export default function NovelDetail() {
  const { id } = useParams();
  const { novels, error: listError } = useNovels();
  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/novels/${id}`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "Load novel detail failed");
        if (alive) setNovel(json.data || null);
      } catch (e) {
        if (alive) setError(e.message || "Có lỗi tải dữ liệu");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) return <div className="novelsdetail-p-4">Đang tải dữ liệu...</div>;
  if (error || listError) return <div className="novelsdetail-p-4">Lỗi: {error || listError}</div>;
  if (!novel) return <div className="novelsdetail-p-4">Không tìm thấy truyện.</div>;

  const fallbackNovel = novels.find((n) => Number(n.id) === Number(id));
  const coverSrc = resolveCover(novel.cover || fallbackNovel?.cover);
  const firstVolume = (novel.volumes || [])[0];

  return (
    <div className="noveldetail-page">
      <section className="noveldetail-hero">
        <div className="noveldetail-cover-wrap">
          <div className="noveldetail-type-badge">{novel.type || "Truyện"}</div>
          <img src={coverSrc} alt={novel.title} className="noveldetail-cover" />
        </div>

        <div className="noveldetail-main">
          <h1 className="noveldetail-title">{novel.title}</h1>
          <div className="noveldetail-genres">
            {(novel.genres || []).map((g) => (
              <span key={g} className="noveldetail-chip">{g}</span>
            ))}
          </div>

          <div className="noveldetail-meta">
            <p><strong>Tác giả:</strong> {novel.author || "Ẩn danh"}</p>
            <p><strong>Họa sĩ:</strong> {novel.authordraw || "Đang cập nhật"}</p>
            <p><strong>Tình trạng:</strong> {novel.status || "Đang cập nhật"}</p>
          </div>

          <div className="noveldetail-stats">
            <div><span>Lượt xem</span><b>{novel.views || "0"}</b></div>
            <div><span>Đánh giá</span><b>{novel.rating || "0 / 0"}</b></div>
            <div><span>Số từ</span><b>{novel.total_words || "Đang cập nhật"}</b></div>
            <div><span>Cập nhật</span><b>{novel.updated_at ? new Date(novel.updated_at).toLocaleDateString("vi-VN") : "Mới nhất"}</b></div>
          </div>
        </div>
      </section>

      <section className="noveldetail-section">
        <h2>Tóm tắt</h2>
        <p>{novel.description || "Chưa có mô tả."}</p>
      </section>

      <section className="noveldetail-section">
        <h2>{firstVolume ? `Tập ${firstVolume.volumeNumber}` : "Tập 1"}</h2>
        {((novel.chapters || []).length > 0 || (novel.volumes || []).length > 0) ? (
          <ChapterList chapters={novel.chapters} volumes={novel.volumes || []} />
        ) : (
          <p>Chưa có chương trong tập này.</p>
        )}
      </section>

      <Link to="/danhsach" className="noveldetail-back">← Quay lại danh sách truyện</Link>
    </div>
  );
}
