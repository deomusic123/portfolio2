/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // PPR solo disponible en Next.js canary
    // ppr: 'incremental',
    staleTimes: {
      dynamic: 30, // 30s para datos dinámicos (leads, projects)
      static: 180, // 3min para datos estáticos (profile)
    },
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    dirs: ['src'],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  transpilePackages: ['@portfolio2/ui'],
};

export default nextConfig;
