import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@boofchi/contracts", "@boofchi/design-tokens"],
};

export default nextConfig;
