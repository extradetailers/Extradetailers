import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // 👇 THIS FIXES THE FATAL ERROR (see section 2)
    root: __dirname,
  },
};

export default nextConfig;
