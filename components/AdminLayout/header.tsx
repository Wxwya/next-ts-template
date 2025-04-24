'use client'
import React, { useState, Fragment, useEffect } from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { avatar } from '@/utils/settings'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/rely/ui_rely'
import { XwyaDropdownMenu, type DropdownMenuOptions } from '@/components/XwyaDropdownMenu'
import { breadcrumbMap, BreadcrumbStruct } from './menu'
import { usePathname } from 'next/navigation'
const options: DropdownMenuOptions[] = [
  { key: 'home', icon: 'solar--home-line-duotone', value: '返回首页' },
  { key: 'logout', className: '!text-red-600', icon: 'solar--square-share-line-broken', value: '退出登录' },
]
const AppMainHead = () => {
  const pathname = usePathname()
  const [list, setList] = useState<BreadcrumbStruct[]>([])

  useEffect(() => {
    setList(breadcrumbMap[window.location.pathname] || [])
  }, [pathname])
  return (
    <div className=" sticky  left-0 top-0 z-50 px-4 pr-8 w-full  bg-[hsl(var(--background))] flex items-center justify-between border-b border-sidebar-border">
      <div className="flex h-14  items-center gap-4">
        <SidebarTrigger />
        <div className=" w-px h-4  bg-sidebar-border"></div>
        <Breadcrumb>
          <BreadcrumbList>
            {list.map((item: BreadcrumbStruct, index: number) => (
              <Fragment key={item.href}>
                <BreadcrumbItem>
                  {item.type === 'link' ? (
                    <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {list.length - 1 !== index && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
        <XwyaDropdownMenu options={options}>
          <div className="flex gap-4 items-center">
            {avatar ? (
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            ) : null}
            <div>xwya</div>
          </div>
        </XwyaDropdownMenu>
      </div>
    </div>
  )
}

export default AppMainHead
