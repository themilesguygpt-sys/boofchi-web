import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@boofchi/contracts", "@boofchi/design-tokens"],
};

initOpenNextCloudflareForDev();

export default nextConfig;
