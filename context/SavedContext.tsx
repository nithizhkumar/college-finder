"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SavedCtx {
  savedIds: string[];
  toggleSave: (id: string) => void;
}

const SavedContext = createContext<SavedCtx | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleSave = (id: string) =>
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <SavedContext.Provider value={{ savedIds, toggleSave }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be inside SavedProvider");
  return ctx;
}
