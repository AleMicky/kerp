import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/kerp/:path*",
        destination: "http://127.0.0.1:8080/kerp/:path*",
      },
    ];
  },
};

export default nextConfig;
