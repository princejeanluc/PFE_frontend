import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol:"https",
        hostname:"assets.coingecko.com",
        port:"",
        pathname:"/**"
      },
      {
        protocol:"https",
        hostname:"coin-images.coingecko.com",
        port:"",
        pathname:"/**"
      },
      {
        protocol:"https",
        hostname:"www.svgrepo.com",
        port:"",
        pathname:"/**"
      },
    ],
  },
};

export default nextConfig;
