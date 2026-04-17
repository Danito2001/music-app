import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc"
      },
      {
        protocol: "https",
        hostname: "www.gstatic.com"
      },
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
      {
        protocol: "https",
        hostname: "cdn-images.dzcdn.net"
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com"
      },
      {
        protocol: "https",
        hostname: "api.deezer.com"
      }
    ]
  }
};

export default nextConfig;
