"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; name: string };

type AuthCtx = {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  onboarded: boolean;
  completeOnboarding: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

const KEY = "cc_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      setUser(parsed.user);
      setOnboarded(parsed.onboarded);
    }
  }, []);

  function login(u: User) {
    localStorage.setItem(KEY, JSON.stringify({ user: u, onboarded: false }));
    setUser(u);
  }

  function logout() {
    localStorage.removeItem(KEY);
    setUser(null);
    setOnboarded(false);
  }

  function completeOnboarding() {
    localStorage.setItem(KEY, JSON.stringify({ user, onboarded: true }));
    setOnboarded(true);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, onboarded, completeOnboarding }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;
