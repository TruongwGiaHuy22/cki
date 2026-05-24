import { Link } from "react-router-dom";

export default function ChapterList({ chapters = [], volumes = [] }) {
  // Đồng bộ cấu trúc dữ liệu theo database thực tế của bạn
  const groupedVolumes = Array.isArray(volumes) && volumes.length > 0
    ? volumes // Hiển thị toàn bộ các volume thay vì chỉ ép lấy volumes[0] nếu cần
    : [{ volume_id: "fallback-v1", volume_number: 1, title: "Mục lục chương", chapters }];

  return (
    <div className="chapterlist-space-y-4">
      {groupedVolumes.map((vol, volIdx) => {
        // Lấy key an toàn cho Volume
        const currentVolId = vol.volume_id || vol.id;
        const uniqueVolKey = currentVolId ? `vol-${currentVolId}` : `vol-idx-${volIdx}`;
        const volNumber = vol.volume_number || vol.volumeNumber || (volIdx + 1);

        return (
          <section key={uniqueVolKey} style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              Tập {volNumber}: {vol.title || `Vol ${volNumber}`}
            </h3>
            
            <ul className="chapterlist-space-y-2" style={{ listStyleType: "none", paddingLeft: "1rem" }}>
              {(vol.chapters || []).map((ch, chIdx) => {
                // Lấy key và ID an toàn cho Chapter theo database thực tế (chapter_id)
                const currentChId = ch.chapter_id || ch.id;
                const uniqueChKey = currentChId ? `ch-${currentChId}` : `ch-idx-${chIdx}`;

                return (
                  <li key={uniqueChKey} style={{ margin: "0.4rem 0" }}>
                    {/* Đường dẫn link chuyển hướng sang trang đọc chương sử dụng chapter_id */}
                    <Link 
                      to={`/chapter/${currentChId}`} 
                      className="chapterlist-text-blue-500"
                      style={{ textDecoration: "none", color: "#3b82f6" }}
                    >
                      {ch.title || `Chương ${ch.chapter_number || (chIdx + 1)}`}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}