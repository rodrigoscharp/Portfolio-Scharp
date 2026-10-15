import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  // links.rodrigoscharp.com serves the link-in-bio page at its root.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "links.rodrigoscharp.com" }],
          destination: "/links",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
