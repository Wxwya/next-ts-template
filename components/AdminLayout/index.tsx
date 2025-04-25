import React, { Suspense} from 'react'
import BlurFade from '@/components/ui/blur-fade'
import AppMainHead from './header'
import Sidebar from './sidebar'
import { SidebarProvider,SidebarInset } from "@/rely/ui_rely"

const variants = {
  hidden: {
    opacity: 0,
    x: -20, // 初始位置为左侧
    y: 0,
  },
  visible: {
    opacity: 1,
    x: 0, // 最终位置回到正常
    y: 0,
    transition: {
      duration: 0.5, // 动画持续时间
    },
  },
}
const Layout = ({ children, info }: { children: React.ReactNode, info: SystemUser.UserInfo }) => {
  
  return (
    <SidebarProvider>
      <Sidebar   />
      <SidebarInset className=' overflow-x-hidden h-screen'>
        <AppMainHead info={info} />
        <Suspense fallback={<div className='w-full h-full flex items-center justify-center'>Loading...</div> }>
        <BlurFade delay={0.25} variant={variants} className=" flex-grow" inView>
          <div className=" h-full p-4 auth-container">{children}</div>
          </BlurFade>
          </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
