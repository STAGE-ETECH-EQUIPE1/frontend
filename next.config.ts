import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'backend-preprod-fx1t.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'backend-prod-vlro.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'orbixup-preprod.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'orbixup.onrender.com',
        pathname: '/**',
      },
    ],
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
