import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/brain-games-hub',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
