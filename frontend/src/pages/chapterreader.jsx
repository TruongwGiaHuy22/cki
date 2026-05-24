import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:4000";

export default function ChapterReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prevChapterId, setPrevChapterId] = useState(null);
  const [nextChapterId, setNextChapterId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch chapter detail
        const chRes = await fetch(`${API_BASE}/api/chapters/${id}`);
        if (!chRes.ok) throw new Error("Lỗi fetch chapter");
        const chJson = await chRes.json();
        if (!chJson.success && !chJson.data) throw new Error("Không tìm thấy chương");
        
        const chapterData = chJson.data || chJson;
        setChapter(chapterData);

        // Fetch novel detail để biết toàn bộ structure
        const novRes = await fetch(`${API_BASE}/api/novels/${chapterData.idln}`);
        if (!novRes.ok) throw new Error("Lỗi fetch novel");
        const novJson = await novRes.json();
        const novelData = novJson.data || novJson;
        setNovel(novelData);

        // Tính toán prev và next chapter
        calculateNavigation(chapterData, novelData);
      } catch (err) {
        console.error("Lỗi:", err);
        setError(err.message || "Lỗi khi tải chương");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const calculateNavigation = (chapterData, novelData) => {
    // Flatten tất cả chapters và tìm current chapter index
    let allChapters = [];
    let currentChapterIndex = -1;

    if (novelData.volumes && Array.isArray(novelData.volumes)) {
      novelData.volumes.forEach((vol) => {
        if (vol.chapters && Array.isArray(vol.chapters)) {
          vol.chapters.forEach((ch) => {
            allChapters.push(ch);
            if (Number(ch.chapter_id) === Number(chapterData.chapter_id)) {
              currentChapterIndex = allChapters.length - 1;
            }
          });
        }
      });
    }

    // Tính prev chapter
    if (currentChapterIndex > 0) {
      setPrevChapterId(allChapters[currentChapterIndex - 1].chapter_id);
    } else {
      setPrevChapterId(null); // Nếu chapter 1, ko có prev
    }

    // Tính next chapter
    if (currentChapterIndex >= 0 && currentChapterIndex < allChapters.length - 1) {
      setNextChapterId(allChapters[currentChapterIndex + 1].chapter_id);
    } else {
      setNextChapterId(null); // Không có chapter tiếp theo
    }
  };

  const handlePrev = () => {
    if (prevChapterId) {
      window.location.href = `/chapter/${prevChapterId}`;
    }
  };

  const handleHome = () => {
    if (chapter && chapter.idln) {
      navigate(`/novel/${chapter.idln}`);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#ffffff", color: "#000000" }}>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#ffffff", color: "#000000" }}>
        <p>Lỗi: {error}</p>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#ffffff", color: "#000000" }}>
        <p>Không tìm thấy chương.</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#ffffff",
      color: "#000000",
      padding: "2rem 1rem"
    }}>
      {/* HEADER */}
      <div style={{
        maxWidth: "800px",
        margin: "0 auto 2rem",
        paddingBottom: "1.5rem",
        borderBottom: "1px solid #e5e7eb"
      }}>
        <h1 style={{
          margin: "0 0 0.5rem 0",
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center"
        }}>
          {chapter.title}
        </h1>
        <p style={{
          margin: 0,
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#6b7280"
        }}>
          Chương {chapter.chapter_number}
        </p>
      </div>

      {/* CONTENT */}
      <div style={{
        maxWidth: "800px",
        margin: "0 auto 2rem",
        lineHeight: "1.8",
        fontSize: "1.05rem",
        color: "#1f2937"
      }}>
        {chapter.content ? (
          <div style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word"
          }}>
            {chapter.content}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#9ca3af" }}>Chưa có nội dung chương.</p>
        )}
      </div>

      {/* NAVIGATION */}
      <div style={{
        maxWidth: "800px",
        margin: "2rem auto 0",
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "1.5rem",
        borderTop: "1px solid #e5e7eb",
        flexWrap: "wrap"
      }}>
        {/* NÚT LÙI */}
        <button
          onClick={handlePrev}
          disabled={!prevChapterId}
          style={{
            padding: "0.75rem 1.5rem",
            background: prevChapterId ? "#2563eb" : "#d1d5db",
            color: prevChapterId ? "#ffffff" : "#9ca3af",
            border: "none",
            borderRadius: "0.5rem",
            cursor: prevChapterId ? "pointer" : "not-allowed",
            fontWeight: "500",
            fontSize: "0.95rem",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            if (prevChapterId) {
              e.target.style.background = "#1d4ed8";
            }
          }}
          onMouseLeave={(e) => {
            if (prevChapterId) {
              e.target.style.background = "#2563eb";
            }
          }}
          title={prevChapterId ? "Chương trước" : "Không có chương trước"}
        >
          ← Lùi
        </button>

        {/* NÚT HOME */}
        <button
          onClick={handleHome}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#10b981",
            color: "#ffffff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "1rem",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#059669";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#10b981";
          }}
          title="Về trang tiểu thuyết"
        >
          🏠
        </button>

        {/* NÚT TIẾN */}
        <button
          onClick={() => {
            if (nextChapterId) {
              window.location.href = `/chapter/${nextChapterId}`;
            }
          }}
          disabled={!nextChapterId}
          style={{
            padding: "0.75rem 1.5rem",
            background: nextChapterId ? "#2563eb" : "#d1d5db",
            color: nextChapterId ? "#ffffff" : "#9ca3af",
            border: "none",
            borderRadius: "0.5rem",
            cursor: nextChapterId ? "pointer" : "not-allowed",
            fontWeight: "500",
            fontSize: "0.95rem",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            if (nextChapterId) {
              e.target.style.background = "#1d4ed8";
            }
          }}
          onMouseLeave={(e) => {
            if (nextChapterId) {
              e.target.style.background = "#2563eb";
            }
          }}
          title={nextChapterId ? "Chương sau" : "Không có chương tiếp theo"}
        >
          Tiến →
        </button>
      </div>

      {/* FOOTER INFO */}
      <div style={{
        maxWidth: "800px",
        margin: "2rem auto 0",
        textAlign: "center",
        fontSize: "0.85rem",
        color: "#9ca3af",
        paddingTop: "1rem"
      }}>
        <p>Chương {chapter.chapter_number} / {novel?.total_chapters || "?"} • {novel?.title || "Tiểu thuyết"}</p>
      </div>
    </div>
  );
}
