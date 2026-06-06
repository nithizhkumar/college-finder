"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User { name: string; email: string; }
interface AuthCtx {
  user: User | null;
  authOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  login: (u: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <AuthContext.Provider value={{
      user,
      authOpen,
      openAuth:  () => setAuthOpen(true),
      closeAuth: () => setAuthOpen(false),
      login:     (u) => { setUser(u); setAuthOpen(false); },
      signOut:   () => { setUser(null); },
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
