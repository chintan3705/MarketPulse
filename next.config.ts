import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Wildcard to allow all hostnames
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**", // Wildcard to allow all hostnames
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA(nextConfig);
