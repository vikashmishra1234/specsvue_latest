import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com','img.freepik.com','lh3.googleusercontent.com','images.unsplash.com'],
  },
  reactStrictMode: false,
  typescript: {
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
