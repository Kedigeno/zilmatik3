import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    // Statik dışa aktarmada 'next/image' optimizasyonunu devre dışı bırakmak için eklendi.
    // Bu, harici görsellerin derleme sırasında sorun çıkarmasını engeller.
    // Gelişmiş görsel optimizasyonu için alternatif çözümler (örn: bulut tabanlı optimizasyon) gerekebilir.
    unoptimized: true,
  },
};

export default nextConfig;
