// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; name: string };

type AuthCtx = {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  onboarded: boolean;
  completeOnboarding: () => Promise<void>; // <- now returns Promise<void>
  hydrated: boolean;
};

const AuthContext = createContext<AuthCtx | null>(null);

const KEY = "cc_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    console.log("[AuthContext] mount - reading localStorage");
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed.user ?? null);
        setOnboarded(parsed.onboarded ?? false);
      } catch (e) {
        console.warn("[AuthContext] failed parsing localStorage", e);
      }
    }
    setHydrated(true);
  }, []);

  // instrumentation: log when user/onboarded changes
  useEffect(() => {
    console.log("[AuthContext] user/onboarded changed", { user, onboarded, hydrated });
  }, [user, onboarded, hydrated]);

  function login(u: User) {
    const payload = { user: u, onboarded: false };
    localStorage.setItem(KEY, JSON.stringify(payload));
    setUser(u);
    setOnboarded(false);
    console.log("[AuthContext] login", u);
  }

  function logout() {
    localStorage.removeItem(KEY);
    setUser(null);
    setOnboarded(false);
    console.log("[AuthContext] logout");
  }

  function completeOnboarding(): Promise<void> {
    // set local storage and state, then return a resolved Promise so callers can await.
    const payload = { user, onboarded: true };
    try {
      localStorage.setItem(KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("[AuthContext] completeOnboarding localStorage write failed", e);
    }

    setOnboarded(true);
    console.log("[AuthContext] completeOnboarding called - onboarded set to true");
    return Promise.resolve();
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, onboarded, completeOnboarding, hydrated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};