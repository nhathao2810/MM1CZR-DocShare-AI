import axios from "axios";

export const BACKEND_URL = "http://localhost:8001";
export const API_BASE_URL = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper chuyển đường dẫn tương đối thành URL đầy đủ của Backend
export const getAssetUrl = (path?: string | null): string => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${BACKEND_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

// Interceptor: Tự động đính kèm JWT Bearer Token vào Headers nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("docshare_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Xử lý lỗi Token hết hạn (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("docshare_token");
      localStorage.removeItem("docshare_user");
    }
    return Promise.reject(error);
  }
);
