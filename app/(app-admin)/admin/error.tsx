
"use client"
import { Button } from "@/rely/ui_rely";
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  }) {
  return (
    <div className="h-full w-full flex flex-col gap-4 items-center justify-center">
      <h2 className="text-xl text-red-500">错误: {error.message}</h2>
      <Button onClick={reset}> 🔄 请尝试重试</Button>
    </div>
  );
}