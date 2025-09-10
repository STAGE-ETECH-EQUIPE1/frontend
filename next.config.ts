import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/generated-ai/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/generated-ai/**',
      },
      {
        protocol: 'https',
        hostname: 'backend-preprod-fx1t.onrender.com',
        pathname: '/generated-ai/**',
      },
      {
        protocol: 'https',
        hostname: 'backend-prod-vlro.onrender.com',
        pathname: '/generated-ai/**',
      },
      {
        protocol: 'https',
        hostname: 'orbixup-preprod.onrender.com',
        pathname: '/generated-ai/**',
      },
      {
        protocol: 'https',
        hostname: 'orbixup.onrender.com',
        pathname: '/generated-ai/**',
      },
    ],
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
