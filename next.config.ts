import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // 关闭严格模式
  /* config options here */
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
    // domains: ['127.0.0.1', "img1.baidu.com"], // 允许加载的图片源的主机名
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/table',
        permanent: false, 
      },
    ]
  },

};

export default nextConfig;
