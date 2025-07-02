/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prd.place',
      },
    ],
  },
  devIndicators: false
  };
  
module.exports = nextConfig;
