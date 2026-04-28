import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/content/docs/:path*.mdx',
        destination: '/llms.mdx/content/docs/:path*'
      }
    ];
  }
};

export default withMDX(config);
