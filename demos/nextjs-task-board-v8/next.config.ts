import type { NextConfig } from "next";

// V8 is a full-stack app deployed to Vercel (frontend + API routes). Unlike
// v0–v7, which static-exported to GitHub Pages under
// /AAM-Demos/nextjs-task-board-vN, there is NO `output: 'export'` and NO
// `basePath` here — V8 serves at the Vercel project root, and its API routes
// run as serverless functions.
const nextConfig: NextConfig = {};

export default nextConfig;
