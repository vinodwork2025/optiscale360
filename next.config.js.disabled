/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  output: 'export',
  distDir: 'out',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/optiscale360' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/optiscale360' : '',
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig