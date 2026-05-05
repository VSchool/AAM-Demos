import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/AAM-Demos/nextjs-bookshelf",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
