import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['mc-heads.net'],
  },
  async rewrites() {
    return [
      {
        source: '/tmn-api/:path*',
        destination: 'https://gift.truemoney.com/:path*',
      },
    ];
  },
};

export default nextConfig;

