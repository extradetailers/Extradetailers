import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // eslint: {
  //   ignoreDuringBuilds: true, // This disables ESLint errors during build time
  // },
  /* config options here */
  sassOptions: {
    // Add any custom Sass options here if needed
    sassOptions: {
      includePaths: ['./styles'],
      quietDeps: true, // 🔕 silences node_modules (Bootstrap) warnings
    },
  },
  turbopack: {
    // 👇 THIS FIXES THE FATAL ERROR (see section 2)
    root: __dirname,
  },
};

export default nextConfig;
