import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useNovels } from "../hooks/useNovels";

export default function ChapterReader() {
  const { id } = useParams();
  const { novels, loading, error } = useNovels();
  const chapter = novels.flatMap(n => n.chapters || []).find(ch => Number(ch.id) === Number(id));
  const [dark, setDark] = useState(false);

  if (loading) return <div className="chapterreader-p-4">Đang tải dữ liệu...</div>;
  if (error) return <div className="chapterreader-p-4">Lỗi: {error}</div>;
  if (!chapter) return <div className="chapterreader-p-4">Không tìm thấy chương.</div>;

  return (
    <div className={dark ? "chapterreader-bg-gray-900 chapterreader-text-white chapterreader-p-4" : "chapterreader-bg-white chapterreader-text-black chapterreader-p-4"}>
      <h2 className="chapterreader-text-xl chapterreader-font-bold chapterreader-mb-4">{chapter.title}</h2>
      <p>{chapter.content || "Chưa có nội dung chương."}</p>
      <div className="chapterreader-flex chapterreader-justify-between chapterreader-mt-4">
        <Link to={`/chapter/${Number(chapter.id) - 1}`}>Prev</Link>
        <button onClick={() => setDark(!dark)}>Toggle Dark Mode</button>
        <Link to={`/chapter/${Number(chapter.id) + 1}`}>Next</Link>
      </div>
    </div>
  );
}
