import type { NextConfig } from "next";

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
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://youtube-like-app-production.up.railway.app/api/:path*",
      },
      {
        source: "/sanctum/:path*",
        destination:
          "https://youtube-like-app-production.up.railway.app/sanctum/:path*",
      },
    ];
  },
};

export default nextConfig;
