import { Link } from "react-router-dom";

export default function ChapterList({ chapters = [], volumes = [] }) {
  const groupedVolumes = Array.isArray(volumes) && volumes.length > 0
    ? [volumes[0]]
    : [{ id: "fallback-v1", volumeNumber: 1, title: "Vol 1", chapters }];

  return (
    <div className="chapterlist-space-y-4">
      {groupedVolumes.map((vol) => (
        <section key={vol.id}>
          <h3>
            Tập {vol.volumeNumber}: {vol.title || `Vol ${vol.volumeNumber}`}
          </h3>
          <ul className="chapterlist-space-y-2">
            {(vol.chapters || []).map((ch) => (
              <li key={ch.id}>
                <Link to={`/chapter/${ch.id}`} className="chapterlist-text-blue-500">
                  {ch.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
