import { useState, useEffect } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "aquaHubUser",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.TOKEN),
  );
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await api.get("/me");
        if (isMounted) {
          const userData = response.data.user || response.data;
          setUser(userData);
          setToken(storedToken);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        }
      } catch {
        if (isMounted) {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const response = await api.post("/login", credentials);
    const { token: newToken, user: userData } = response.data;

    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);

    return response.data;
  };

  const register = async (formData) => {
    const response = await api.post("/register", formData);
    const { token: newToken, user: userData } = response.data;

    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);

    return response.data;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // Clean up storage even if request fails
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
