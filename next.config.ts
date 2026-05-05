import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize image domains untuk avatar
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"],
  },

  // Environment variables yang aman di-expose ke client
  env: {
    NEXT_PUBLIC_APP_NAME: "MindBridge",
  },

  // Logging untuk development
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
};

export default nextConfig;
