"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { apiFetch, setToken, getToken } from "@/lib/api-client";

// ============================================================
// Auth state for the whole app. Holds the current user (or null), restores
// the session on load by validating the stored JWT against /api/auth/me, and
// exposes login / signup / logout.
// ============================================================

export interface AuthUser {
  email: string;
  name: string;
  createdAt?: string;
}

interface AuthStore {
  user: AuthUser | null;
  ready: boolean; // false until the initial /me check resolves
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthStore | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  // On load, if we have a token, confirm it's still valid and load the user.
  useEffect(() => {
    let cancelled = false;
    async function restore() {
      if (!getToken()) {
        setReady(true);
        return;
      }
      try {
        const data = await apiFetch<{ user: AuthUser }>("/api/auth/me");
        if (!cancelled) setUser(data.user);
      } catch {
        // Expired/invalid token — clear it.
        setToken(null);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ token: string; user: AuthUser }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
    );
    setToken(data.token);
    setUser(data.user);
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const data = await apiFetch<{ token: string; user: AuthUser }>(
        "/api/auth/signup",
        { method: "POST", body: JSON.stringify({ name, email, password }) },
      );
      setToken(data.token);
      setUser(data.user);
    },
    [],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, signup, logout }),
    [user, ready, login, signup, logout],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthStore {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>");
  return v;
}
