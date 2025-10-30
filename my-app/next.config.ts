import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "asset.indonesia.travel",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "webasset.b-cdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "satutravel.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "statik.tempo.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
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
      }
    ],
  },
};

export default nextConfig;
