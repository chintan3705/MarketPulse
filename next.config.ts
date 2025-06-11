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
  allowedDevOrigins: [
    "https://6000-firebase-studio-1749449208147.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev",
  ],
};

export default nextConfig;
