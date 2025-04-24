"use client";
import React from 'react'
import Image from 'next/image';
import {SidebarMenu,SidebarMenuItem,SidebarMenuButton,useSidebar } from "@/components/ui/sidebar"
const SidebarHeader = () => {
  const { open } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className={` hover:bg-transparent hover:text-inherit !py-8 ${open ? '' : 'group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-10'}`}>
          <div className='flex size-10 aspect-square  items-center     '>
            <Image src="" className=' size-10 rounded-xl bg-black' alt="" /> 
          </div>
          <div className=' font-bold text-black text-lg'>
          Xwya 后台管理系统
        </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
      </SidebarMenu>
  )
}
export default SidebarHeader