import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "youtube-like-app-production.up.railway.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
        // "https://youtube-like-app-production.up.railway.app/api/:path*",
      },
      {
        source: "/sanctum/:path*",
        destination: `${backendUrl}/sanctum/:path*`,
        // "https://youtube-like-app-production.up.railway.app/sanctum/:path*",
      },
    ];
  },
};

export default nextConfig;
