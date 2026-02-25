import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // Dockerデプロイ用
  images: {
    unoptimized: true, // Vercelで最適化
  },
  env: {
    APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
  },
  // 開発サーバー設定
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;