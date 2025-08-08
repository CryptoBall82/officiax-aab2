import type { NextConfig } from "next";

    const nextConfig: NextConfig = {
      output: 'export', // THIS IS THE CRUCIAL LINE

      // If you had other configurations, they would also be here
      // e.g., images: { unoptimized: true } if needed
    };

    export default nextConfig;