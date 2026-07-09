/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/fieldnote-research',
  assetPrefix: '/fieldnote-research/',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
