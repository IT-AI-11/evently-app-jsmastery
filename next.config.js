

// original
// /** @type {import('next').NextConfig} */
// const nextConfig = {}
// module.exports = nextConfig


//new
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['utfs.io'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'utfs.io',
          port: ''
        }
      ]
    }
  }
  
  module.exports = nextConfig
