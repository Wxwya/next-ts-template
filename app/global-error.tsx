'use client';
import { useEffect } from 'react';
import { Button } from '@/rely/ui_rely';
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('捕获到全局错误:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f0f2f5',
          }}
        >
          <h1 className=' text-2xl font-bold'>💥 出了点问题</h1>
          <div className=' text-base text-red-600 my-4'>错误信息: {error.message}</div>
          <Button onClick={() => reset()}> 🔄 尝试刷新  </Button>
        </div>
      </body>
    </html>
  );
}