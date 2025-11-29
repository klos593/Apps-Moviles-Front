import React, { createContext, useContext, useEffect, useState } from "react";
import { URL } from "../../api/url";
import { secureDel, secureGet, secureSet } from "../utils/secureStorage";

type RegisterInput = {
  name: string;
  lastName?: string;
  phone?: string;
  email: string;
  password: string;
};

type User = {
  id: number;
  email: string;
  name: string;
  lastName: string;
};

type AppMode = "user" | "provider";

type AuthState = {
  isBooting: boolean;
  token: string | null;
  user: User | null;
  mode: AppMode;                 
  setMode: (m: AppMode) => void;   
  toggleMode: () => void;
  login: (p: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register: (p: RegisterInput) => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppMode>("user");
  const [isBooting, setIsBooting] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const [t, u, rawMode] = await Promise.all([
        secureGet("token"),
        secureGet("user"),
        secureGet("mode"),   
      ]);

      if (t) setToken(t);

      if (u) {
        try {
          setUser(JSON.parse(u) as User);
        } catch {
          await secureDel("user");
        }
      }

      if (rawMode === "provider" || rawMode === "user") {
        setModeState(rawMode);
      } else {
        setModeState("user");
      }

      setIsBooting(false);
    })();
  }, []);

  const setMode = async (m: AppMode) => {
    setModeState(m);
    await secureSet("mode", m);
  };

  const toggleMode = () => {
    setModeState((prev) => {
      const next = prev === "user" ? "provider" : "user";
      secureSet("mode", next);
      return next;
    });
  };

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
    await secureDel("mode");      
    setToken(null);
    setUser(null);
    setModeState("user");
  };

  const register: AuthState["register"] = async (payload) => {
    const res = await fetch(`${URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Register failed");
    }
    const data: { token: string; user: User } = await res.json();
    await secureSet("token", data.token);
    await secureSet("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  return (
    <AuthCtx.Provider
      value={{
        isBooting,
        token,
        user,
        mode,   
        setMode,
        toggleMode,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export const useAuthUser = () => {
  const { user, isBooting } = useAuth();

  if (isBooting) {
    throw new Error("Auth is still booting, cannot access user yet");
  }

  if (!user) {
    throw new Error("No hay un usuario autenticado");
  }

  return user;
};
export const useAuthUserOptional = () => {
  const { user, isBooting } = useAuth();
  return { user, isBooting };
};