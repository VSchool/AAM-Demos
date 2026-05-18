import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/AAM-Demos/nextjs-task-board-v1",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
