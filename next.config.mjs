/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: "build",
    env: {
      SERVER: process.env.SERVER,
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: "longfei-cn.s3.ap-southeast-1.amazonaws.com",
          },
        ],
      },
      reactStrictMode: false
};

export default nextConfig;
