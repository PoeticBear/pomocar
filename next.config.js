/** @type {import('next').NextConfig} */
const nextConfig = {
  // 确保图片域名被允许
  images: {
    domains: ['pomodorocar.com'],
  },
  // 添加重定向，确保旧链接仍然有效
  async redirects() {
    return [];
  },
  // 添加头信息，增强安全性
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;