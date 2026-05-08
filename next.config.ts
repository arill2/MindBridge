import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Logging untuk development
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
};

export default nextConfig;
