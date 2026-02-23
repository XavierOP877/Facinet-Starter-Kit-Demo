import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Force webpack to use facinet's ESM entry (sdk.mjs) which has
      // proper static imports, instead of browser.js which uses dynamic
      // require() that webpack can't resolve at runtime.
      config.resolve.alias = {
        ...config.resolve.alias,
        facinet: path.resolve(
          __dirname,
          'node_modules/facinet/dist/sdk.mjs'
        ),
      };

      // Stub out Node.js builtins that ethers/facinet may reference
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        child_process: false,
        readline: false,
      };
    }
    return config;
  },
};

export default nextConfig;
