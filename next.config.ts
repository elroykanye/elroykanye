import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The native MongoDB driver should not be bundled — keep it external so it
  // loads at runtime in route handlers.
  serverExternalPackages: ["mongodb"],
};

export default nextConfig;
