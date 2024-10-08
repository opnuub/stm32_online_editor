/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: "build",
    env: {
      SERVER: process.env.SERVER,
    },
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: process.env.HOST,
            port: '8000',
            pathname: '/images/**',
          },
        ],
      },
      reactStrictMode: false
};

export default nextConfig;
