import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/AAM-Demos/nextjs-task-board-v0",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
