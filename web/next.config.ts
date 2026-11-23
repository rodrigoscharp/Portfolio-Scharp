import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Servidor enxuto para a imagem Docker da VPS (deploy/). A Vercel ignora.
  output: "standalone",
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
