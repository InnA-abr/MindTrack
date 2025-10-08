import api from "../api/apiClient";

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
