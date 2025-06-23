import type { NextConfig } from "next";

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

export default nextConfig;
