import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mc-heads.net',
        port: '',
        pathname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb'
    }
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

