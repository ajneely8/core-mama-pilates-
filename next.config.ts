import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Add the client's CDN / asset host here when real photos arrive.
    remotePatterns: [],
    // Allow near-lossless output for the small source files we have.
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
