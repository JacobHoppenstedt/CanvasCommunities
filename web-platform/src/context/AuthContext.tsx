"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; name: string };

type AuthCtx = {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  onboarded: boolean;
  completeOnboarding: () => void;
  hydrated: boolean; // 👈 NEW
};

const AuthContext = createContext<AuthCtx | null>(null);

const KEY = "cc_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [hydrated, setHydrated] = useState(false); // 👈 NEW

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      setUser(parsed.user ?? null);
      setOnboarded(parsed.onboarded ?? false);
    }
    setHydrated(true);
  }, []);

  function login(u: User) {
    const payload = { user: u, onboarded: false };
    localStorage.setItem(KEY, JSON.stringify(payload));
    setUser(u);
    setOnboarded(false);
  }

  function logout() {
    localStorage.removeItem(KEY);
    setUser(null);
    setOnboarded(false);
  }

  function completeOnboarding() {
    const payload = { user, onboarded: true };
    localStorage.setItem(KEY, JSON.stringify(payload));
    setOnboarded(true);
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