import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthModal } from "@/components/AuthModal";
import { AuthProvider } from "@/context/AuthContext";
import { CompareProvider } from "@/context/CompareContext";
import { SavedProvider } from "@/context/SavedContext";
import { CompareBar } from "@/components/CompareBar";

export const metadata: Metadata = {
  title: "CollegeFinder – Discover Your Dream College in India",
  description:
    "Search, compare, and explore top colleges across India. Detailed placement stats, reviews, Q&A, and side-by-side comparison.",
  keywords: ["college search india", "IIT", "NIT", "BITS", "college comparison", "placement stats"],
  openGraph: {
    title: "CollegeFinder",
    description: "India's most detailed college discovery platform",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }} className="bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <CompareProvider>
            <SavedProvider>
              <Navbar />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {children}
              </main>
              <CompareBar />
              <AuthModal />
            </SavedProvider>
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
