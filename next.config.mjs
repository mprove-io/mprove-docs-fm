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
      },
      {
        source: '/content/cli/:path*.mdx',
        destination: '/llms.mdx/content/cli/:path*'
      },
      {
        source: '/content/openapi/:path*.mdx',
        destination: '/llms.mdx/content/openapi/:path*'
      }
    ];
  }
};

export default withMDX(config);
