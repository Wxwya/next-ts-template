'use client';
import type { ImageLoader, ImageLoaderProps } from 'next/image';

 const imageLoader: ImageLoader = ({
  src,
  width,
  quality,
 }: ImageLoaderProps): string => {
   // 第三方优化使用
  //  console.log(src);
   
  const q = quality ?? 75;
  const base = src.startsWith('http')
    ? src
    // ${process.env.NEXT_PUBLIC_CDN_URL}/
    : `${src}`;

  const params = new URLSearchParams({
    w: width.toString(),
    q: q.toString(),
    f: 'auto',
  });
  return `${base}?${params}`;
};

export default imageLoader;