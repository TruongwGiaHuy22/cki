// Utility for handling image URLs from backend uploads
const API_BASE = "http://localhost:4000";

/**
 * Convert cover filename to full backend URL
 * @param {string} cover - Cover filename or path
 * @returns {string} Full URL to the image
 */
export function getImageUrl(cover) {
  if (!cover) {
    // Return default image if no cover provided
    return `${API_BASE}/uploads/noname29.png`;
  }

  const raw = String(cover).trim();
  
  // If already a full URL (starts with http), return as is
  if (raw.startsWith("http")) {
    return raw;
  }

  // If it's a path starting with /uploads, prepend API_BASE
  if (raw.startsWith("/uploads")) {
    return `${API_BASE}${raw}`;
  }

  // If it's just a filename, assume it's in uploads folder
  if (!raw.includes("/")) {
    return `${API_BASE}/uploads/${raw}`;
  }

  // For any other format, try to construct upload URL
  const fileName = raw.split("/").pop();
  return `${API_BASE}/uploads/${fileName}`;
}

/**
 * Alias for getImageUrl - used for cover images
 * Defaults to noname29.png if no cover provided
 */
export const getCoverUrl = getImageUrl;

/**
 * List of available images in backend/uploads
 * Used for fallback when cover is not specified
 */
export const AVAILABLE_IMAGES = [
  "aii1.jpg",
  "hero.png",
  "ln.png",
  "noname2.jpg",
  "noname3.jpg",
  "noname4.jpg",
  "noname5.jpg",
  "noname6.jpg",
  "noname7.jpg",
  "noname8.jpg",
  "noname9.jpg",
  "noname10.jpg",
  "noname11.jpg",
  "noname12.jpg",
  "noname13.jpg",
  "noname14.jpg",
  "noname15.jpg",
  "noname16.jpg",
  "noname17.jpg",
  "noname18.jpg",
  "noname19.jpg",
  "noname20.jpeg",
  "noname21.jpg",
  "noname22.jpg",
  "noname23.jpg",
  "noname24.jpg",
  "noname26.jpg",
  "noname27.png",
  "noname28.jpg",
  "noname29.png",
  "noname33.jpg",
  "noname34.jpg",
  "noname35.jpg",
  "noname36.jpg",
  "noname37.jpg",
  "noname38.png",
  "noname39.jpg",
  "noname40.png",
  "noname41.jpg",
  "react.svg",
  "st1.jpg",
  "thiensu.jpg",
  "vite.svg",
  "xemthem.png",
];
