"use client";

import { useCompare } from "@/context/CompareContext";
import { useSaved } from "@/context/SavedContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { compareList } = useCompare();
  const { savedIds } = useSaved();
  const { user, openAuth, signOut } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "🔍 Discover" },
    { href: "/compare", label: "⚖️ Compare", count: compareList.length },
    { href: "/saved",   label: "♥ Saved",   count: savedIds.length },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="font-extrabold text-lg tracking-tight flex-shrink-0">
          <span className="text-blue-700">🎓</span>{" "}
          <span className="text-gray-900">College</span>
          <span className="text-blue-700">Finder</span>
        </Link>

        {/* Nav Links */}
        <div className="flex gap-1 flex-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                )}
              >
                {link.label}
                {link.count ? (
                  <span className="bg-blue-700 text-white text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">
                    {link.count}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* Auth */}
        {user ? (
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
              {user.name[0].toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user.name}</span>
            <button
              onClick={signOut}
              className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={openAuth}
            className="bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-800 transition-colors flex-shrink-0"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
