import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.customMessage = "Мережа або сервер не доступні";
    } else if (error.response.status === 401) {
      error.customMessage = "Неавторизований доступ";
    } else {
      error.customMessage = error.response.data.error || "Сталася помилка";
    }
    return Promise.reject(error);
  }
);

export default api;
