import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Constrain the set of generated widths so the Service Worker caches far
    // fewer /_next/image variants per source — this raises the offline cache-hit
    // rate (a previously-cached width is much more likely to be the one requested).
    deviceSizes: [640, 750, 1080, 1920],
    imageSizes: [256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.up.railway.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
