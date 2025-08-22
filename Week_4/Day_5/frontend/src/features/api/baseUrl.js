// Prefer VITE_API_URL; fallback localhost
const baseUrl = import.meta?.env?.VITE_API_URL || "http://localhost:5000/api/";
export default baseUrl;
