/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: "build",
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: '54.179.90.179',
            port: '8000',
            pathname: '/images/**',
          },
        ],
      },
      reactStrictMode: false
};

export default nextConfig;
