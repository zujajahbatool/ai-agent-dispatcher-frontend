import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/kestra/:path*',
        destination: 'http://kestra:kestra@localhost:8080/api/v1/:path*', 
      },
    ];
  },
};

export default nextConfig;