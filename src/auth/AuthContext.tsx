// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { secureGet, secureSet, secureDel } from "../utils/secureStorage";
import {URL} from "../../api/url"

type User = {   
  id: number;
  email: string;
  name: string;
  lastName: string;
}; 

type AuthState = {
  isBooting: boolean;
  token: string | null;
  user: User | null;
  login: (p: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isBooting, setIsBooting] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    (async () => {
      const t = await secureGet("token");
      const u = await secureGet("user");
      if (t) setToken(t);
      if (u) {
        try {
          setUser(JSON.parse(u) as User);
        } catch {
          await secureDel("user");
        }
      }
      setIsBooting(false);
    })();
  }, []);

  const login: AuthState["login"] = async ({ email, password }) => {

    const res = await fetch(`${URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Login failed");
    }
    const data: { token: string; user: User } = await res.json();

    await secureSet("token", data.token);
    await secureSet("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await secureDel("token");
    await secureDel("user");
    await secureDel("refresh_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ isBooting, token, user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};