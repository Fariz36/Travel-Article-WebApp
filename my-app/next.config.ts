import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.travel",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
