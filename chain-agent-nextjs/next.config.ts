import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [

      {
        source: "/api/:path*",
        destination: "http://localhost:4399/:path*"
      },
    ];
  },
};

export default nextConfig;
