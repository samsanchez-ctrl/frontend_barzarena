import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    username: localStorage.getItem("username") || null,
    roles: JSON.parse(localStorage.getItem("roles") || "[]"),
    saldo: parseFloat(localStorage.getItem("saldo") || "0"),
  });

  const isLoggedIn = !!auth.token;

  const isAdmin = auth.roles?.some(
    (r) => r === "ROLE_ADMIN" || r?.name === "ROLE_ADMIN" || r?.authority === "ROLE_ADMIN"
  );

  const login = (data) => {
    const { token, username, roles, saldo } = data;

    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("roles", JSON.stringify(roles));
    localStorage.setItem("saldo", saldo);

    setAuth({ token, username, roles, saldo });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
    localStorage.removeItem("saldo");
    setAuth({ token: null, username: null, roles: [], saldo: 0 });
  };

  const refreshUser = async () => {
    try {
      const res = await api.get("/api/users/me");
      const newSaldo = res.data.saldo ?? auth.saldo;
      localStorage.setItem("saldo", newSaldo);
      setAuth((prev) => ({ ...prev, saldo: newSaldo }));
    } catch (e) {
      // si falla, no rompemos la app
    }
  };

  useEffect(() => {
    if (auth.token) {
      refreshUser();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={{ auth, isLoggedIn, isAdmin, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
