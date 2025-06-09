
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
        pathname: "/**", // Allows any path from this hostname
      },
    ],
  },
  allowedDevOrigins: [
    "https://6000-firebase-studio-1749449208147.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev",
  ],
};

export default nextConfig;
