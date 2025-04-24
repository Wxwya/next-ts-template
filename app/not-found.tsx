import React from 'react'
import { Button } from '@/rely/ui_rely'
import Link from 'next/link'
export default function NotFound() {
  return (
    <div className=" h-screen w-full flex justify-center items-center">
      <div className=" text-center">
        <div className=" text-8xl relative animate-glitch">
          <span className=" animate-glitchTop absolute left-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 33%, 0 33%)' }}>
            404
          </span>
          <span>404</span>
          <span className=" animate-glitchBotom absolute left-0" style={{ clipPath: 'polygon(0 67%, 100% 67%, 100% 100%, 0 100%)' }}>404</span>
        </div>
        <Link href="/">
          <Button className="mt-20 text-base">返回首页</Button>
        </Link>
      </div>
    </div>
  )
}
