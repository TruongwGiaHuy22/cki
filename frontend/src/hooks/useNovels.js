import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:4000";
const assets = import.meta.glob("../assets/*.{png,jpg,jpeg,webp,svg}", { eager: true });

const assetByName = Object.fromEntries(
  Object.entries(assets).map(([p, mod]) => [p.split("/").pop().toLowerCase(), mod.default])
);

function resolveCover(cover, id) {
  if (!cover) return assetByName["noname29.png"];
  const raw = String(cover).trim();
  if (!raw) return assetByName["noname29.png"];
  if (raw.startsWith("http")) return raw;

  const file = raw.replace(/^\/+/, "").toLowerCase();
  if (assetByName[file]) return assetByName[file];

  const base = file.replace(/\.[^.]+$/, "");
  const candidate = Object.keys(assetByName).find((name) => name.replace(/\.[^.]+$/, "") === base);
  if (candidate) return assetByName[candidate];

  return assetByName["noname29.png"];
}

export function useNovels() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/novels`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "Load novels failed");
        if (alive) {
          const mapped = (json.data || []).map((n) => ({
            ...n,
            id: n.idln,
            genres: Array.isArray(n.genres) ? n.genres : [],
            chapters: Array.isArray(n.chapters) ? n.chapters : [],
            cover: resolveCover(n.cover, n.idln),
            author: n.author || n.authordraw || "Ẩn danh",
          }));
          setNovels(mapped);
        }
      } catch (e) {
        if (alive) setError(e.message || "Có lỗi tải dữ liệu");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return useMemo(() => ({ novels, loading, error }), [novels, loading, error]);
}
