/** @type {import('next').NextConfig} */
const nextConfig = {
  
  images: {
    // qualities: [75, 85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Strict mode for better development experience
  reactStrictMode: true,
};

module.exports = nextConfig;
