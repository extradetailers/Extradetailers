import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // This disables ESLint errors during build time
  },
  /* config options here */
  sassOptions: {
    // Add any custom Sass options here if needed
    includePaths: ['./styles'], // Optional: specify path to your Sass files
  },
  webpack(config) {
    // Remove the manual Sass loader configuration since Next.js handles this natively
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
    });

    return config;
  },
};

export default nextConfig;
