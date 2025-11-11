import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['mico-images-directory.s3.eu-north-1.amazonaws.com'],
  },
};

export default nextConfig;
