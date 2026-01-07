// src/context/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { User } from "@/types/user";

/* --------------------------------------
   CONTEXT
---------------------------------------*/
type AuthCtx = {
  user: User | null;
  token: string | null;
  login: (payload: { access: string; refresh?: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  ready: boolean;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

/* --------------------------------------
   PROVIDER
---------------------------------------*/
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  /* --------------------------------------
     INIT — hydrate depuis localStorage + /me
  ---------------------------------------*/
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedAccess = localStorage.getItem("access_token");
      if (!storedAccess) {
        setInitialized(true);
        setLoading(false);
        return;
      }

    setToken(storedAccess);

    const init = async () => {
      try {
        const res = await api.get("/me/");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch {
        logout();
      } finally {
        setInitialized(true);
        setLoading(false);
      }
    };

    init();
  }, []);

  /* --------------------------------------
     LOGIN
  ---------------------------------------*/
  const login = async (payload: { access: string; refresh?: string }) => {
    // ✅ stockage NORMALISÉ
    localStorage.setItem("access_token", payload.access);
    setToken(payload.access);

    if (payload.refresh) {
      localStorage.setItem("refresh_token", payload.refresh);
    }

    // 🔑 récupérer l'utilisateur réel
    const res = await api.get("/me/");
    setUser(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));
  };

  /* --------------------------------------
     LOGOUT
  ---------------------------------------*/
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  };

  console.log("AUTH PROVIDER → user =", user);
  console.log("AUTH PROVIDER → role =", user?.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        ready: initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* --------------------------------------
   HOOK
---------------------------------------*/
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
