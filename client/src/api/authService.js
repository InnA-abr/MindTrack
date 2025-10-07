import api from "./apiClient";

export const register = async (userData) => {
  try {
    const { data } = await api.post("/auth/register", userData);
    return data;
  } catch (err) {
    throw new Error(
      err.response?.data?.error || err.message || "Помилка реєстрації"
    );
  }
};

export const login = async (loginOrEmail, password) => {
  try {
    const { data } = await api.post("/auth/login", { loginOrEmail, password });
    return data;
  } catch (err) {
    throw new Error(
      err.response?.data?.error || err.message || "Помилка логіну"
    );
  }
};
