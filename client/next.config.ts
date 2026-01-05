import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // eslint: {
  //   ignoreDuringBuilds: true, // This disables ESLint errors during build time
  // },
  /* config options here */
  sassOptions: {
    // Add any custom Sass options here if needed
    includePaths: ['./styles'], // Optional: specify path to your Sass files
  }
};

export default nextConfig;
