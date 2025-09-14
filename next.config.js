/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', '192.168.1.165'],
  },
}

module.exports = nextConfig
