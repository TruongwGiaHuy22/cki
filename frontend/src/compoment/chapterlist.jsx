import { Link } from "react-router-dom";

// Hàm format ngày thành DD/MM/YYYY
function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "";
  }
}

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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Link 
                        to={`/chapter/${currentChId}`} 
                        className="chapterlist-text-blue-500"
                        style={{ textDecoration: "none", color: "#3b82f6", flex: 1 }}
                      >
                        {ch.title || `Chương ${ch.chapter_number || (chIdx + 1)}`}
                      </Link>
                      <span style={{ fontSize: "0.85rem", color: "#94a3b8", marginLeft: "1rem", whiteSpace: "nowrap" }}>
                        {formatDate(ch.created_at)}
                      </span>
                    </div>
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