import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:4000";

export default function QuanLyTruyen() {
  const [novels, setNovels] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [detail, setDetail] = useState(null);

  const navigate = useNavigate();

  // load list truyện
  useEffect(() => {
    fetch(`${API_BASE}/api/novels`)
      .then((res) => res.json())
      .then((data) => setNovels(data.data || data))
      .catch((err) => console.error(err));
  }, []);

  // mở truyện
  async function openNovel(novel) {
    setSelectedNovel(novel);

    const res = await fetch(`${API_BASE}/api/novels/${novel.idln}`);
    const json = await res.json();

    setDetail(json.data || json);
  }

  // reload lại truyện đang chọn
  async function reloadCurrentNovel() {
    if (!selectedNovel) return;
    openNovel(selectedNovel);
  }

  // tạo volume
  async function createVolume(idln) {
    await fetch(`${API_BASE}/api/volumes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idln,
        volume_number: 1,
        title: "Volume mới",
      }),
    });

    reloadCurrentNovel();
  }

  // tạo chapter
  async function createChapter(volume_id) {
    await fetch(`${API_BASE}/api/chapters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idln: selectedNovel.idln,
        volume_id,
        title: "Chapter mới",
        chapter_number: 1,
      }),
    });

    reloadCurrentNovel();
  }

  return (
    <div className="dangtruyen-page">

      {/* 🔥 NAVBAR giống DangTruyen */}
      <nav className="dangtruyen-topnav">
        <button onClick={() => navigate("/dang-truyen")}>
          Thêm Truyện mới
        </button>

        <button className="active" onClick={() => navigate("/quan-ly-truyen")}>
          Q.Lý truyện
        </button>

        <button>Q.Lý Convert</button>
        <button>Q.Lý Sáng tác</button>
        <button>Q.Lý Trang</button>
        <button>Tiện ích</button>
      </nav>

      {/* MAIN LAYOUT */}
      <div className="ql-container">

        {/* LEFT SIDEBAR */}
        <div className="ql-sidebar">
          <h3>📚 Truyện</h3>

          {novels.map((n) => (
            <div
              key={n.idln}
              className={`ql-novel-item ${
                selectedNovel?.idln === n.idln ? "active" : ""
              }`}
              onClick={() => openNovel(n)}
            >
              {n.title}
            </div>
          ))}
        </div>

        {/* RIGHT CONTENT */}
        <div className="ql-content">

          {!detail ? (
            <p>Chọn một truyện để quản lý</p>
          ) : (
            <>
              <div className="ql-header">
                <h2>📖 {detail.title}</h2>

                <button
                  className="btn-add"
                  onClick={() => createVolume(detail.idln)}
                >
                  + Thêm Volume
                </button>
              </div>

              {/* VOLUME LIST */}
              <div className="volume-list">

                {detail.volumes?.length === 0 && (
                  <p>Chưa có volume</p>
                )}

                {detail.volumes?.map((vol) => (
                  <div key={vol.volume_id} className="volume-box">

                    <div className="volume-header">
                      <h3>
                        📦 {vol.title || `Volume ${vol.volume_number}`}
                      </h3>

                      <button
                        className="btn-small"
                        onClick={() => createChapter(vol.volume_id)}
                      >
                        + Chapter
                      </button>
                    </div>

                    {/* CHAPTER LIST */}
                    <div className="chapter-list">

                      {vol.chapters?.length === 0 && (
                        <p>Chưa có chapter</p>
                      )}

                      {vol.chapters?.map((ch) => (
                        <div key={ch.chapter_id} className="chapter-item">
                          📄 {ch.title}
                        </div>
                      ))}

                    </div>
                  </div>
                ))}

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}