import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['static.lenskart.com','static1.lenskart.com','static5.lenskart.com','res.cloudinary.com','img.freepik.com'],
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
