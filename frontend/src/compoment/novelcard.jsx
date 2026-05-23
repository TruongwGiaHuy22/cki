import { Link } from "react-router-dom";

export default function NovelCard({ novel }) {
  return (
    <div className="novelcard-bg-white novelcard-dark:bg-gray-800 novelcard-shadow novelcard-rounded novelcard-overflow-hidden novelcard-hover:scale-105 novelcard-transition">
      <img src={novel.cover} alt={novel.title} className="novelcard-w-full novelcard-h-48 novelcard-object-cover" />
      <div className="novelcard-p-3">
        <h3 className="novelcard-font-bold novelcard-text-lg">{novel.title}</h3>
        <p className="novelcard-text-sm">{(Array.isArray(novel.genres) ? novel.genres.join(", ") : "")}</p>
        <p className="novelcard-text-xs novelcard-text-gray-500">{novel.status}</p>
        <Link to={`/novel/${novel.id}`} className="novelcard-text-blue-500 novelcard-mt-2 novelcard-block">Chi tibt</Link>
      </div>
    </div>
  );
}
