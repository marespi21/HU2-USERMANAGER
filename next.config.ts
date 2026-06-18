import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita el aviso de "múltiples lockfiles" cuando trabajas en HU2
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
