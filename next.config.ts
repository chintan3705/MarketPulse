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
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.benzinga.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.seekingalpha.com",
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
