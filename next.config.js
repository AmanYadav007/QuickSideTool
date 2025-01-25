/** @type {import('next').NextConfig} */
const nextConfig = {
    api: {
      responseLimit: '32mb',
      bodyParser: {
        sizeLimit: '32mb',
      },
    },
    // Add any other Next.js config options you need
  }
  
  module.exports = nextConfig