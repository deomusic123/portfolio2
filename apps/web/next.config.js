/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimizado para landing estático
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  transpilePackages: ['@portfolio2/ui'],
};

export default nextConfig;
