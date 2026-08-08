import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// The backend serves uploaded/seeded images from /static, alongside the /api routes.
export const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

// Product/category images are stored as paths like "/static/images/bedroom/img-1.jpg".
// This resolves them against the backend origin; absolute URLs pass through unchanged.
export function resolveImageUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return `${ASSET_BASE_URL}${path}`;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("furniflex_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
