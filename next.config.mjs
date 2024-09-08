/** @type {import('next').NextConfig} */

import NextFederationPlugin from "@module-federation/nextjs-mf";

const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "github-coffee-api",
        remotes: {},
        filename: "static/chunks/remoteEntry.js",
        exposes: {
          "./index": "./pages/index.tsx",
        },
        // shared: createSharedDependencies(),
      })
    );
    return config;
  },
  eslint: {
    dirs: ["."], //or ['pages', 'hooks']
  },
};

export default nextConfig;
