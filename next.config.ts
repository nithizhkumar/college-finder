import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // For Next.js 15+ params as Promise
  },
  // Strict mode for better error detection
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.1.4"],
};

export default nextConfig;
