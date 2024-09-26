/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: "build",
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: '127.0.0.1',
            port: '8000',
            pathname: '/images/**',
          },
        ],
      },
      reactStrictMode: false
};

export default nextConfig;
