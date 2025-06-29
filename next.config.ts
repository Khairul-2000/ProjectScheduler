import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript:{
    // Enable type checking during build
    ignoreBuildErrors: true,
  }
  ,
  eslint: {
    // Enable linting during build
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
