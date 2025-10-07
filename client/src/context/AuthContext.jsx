import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    const savedUser = localStorage.getItem("userProfile");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const setUser = (updatedUser) => {
    if (!updatedUser) {
      localStorage.removeItem("userProfile");
      setUserState(null);
      return;
    }
    const {
      avatarUrl,
      awards,
      email,
      firstName,
      followers,
      id,
      lastName,
      login,
      followedBy,
    } = updatedUser || {};

    const userData = {
      avatarUrl,
      awards,
      email,
      firstName,
      followers,
      id,
      lastName,
      login,
      followedBy,
    };
    localStorage.setItem("userProfile", JSON.stringify(userData));
    setUserState(userData);
  };

  const verifyToken = async () => {
    try {
      const response = await api.get("/auth/me");

      setUser(response.data);
    } catch (error) {
      console.log("verifyToken failed", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      localStorage.setItem("token", token);
      verifyToken();
    } else {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("userProfile");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
