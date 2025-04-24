'use client'
import React, { useEffect, useState } from 'react'
import { SidebarMenuButton,DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/rely/ui_rely"
import { useTheme } from 'next-themes'
import { isClient } from '@/utils'
const options: GlobalOptions[] = [
  { label: '极简', value: 'light' },
  { label: '极简黑', value: 'dark' },
  { label: '跟随系统', value: 'system' },
]
let darkModeMediaQuery: MediaQueryList |null = null
const SidebarFooter = () => {
  if (isClient()) { 
    darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  }
  const { theme, setTheme } = useTheme()
  const [icon, setIcon] = useState('solar--sun-bold')
  const onChange = (value:any) => {
    getSystemTheme()
    setTheme(value)
  }
  const getSystemTheme = () => {
    if ((theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) || theme === 'dark') {
      setIcon('solar--moon-bold')
      return
    }
    setIcon('solar--sun-bold')
  }
  // 监听系统主题变化
  const handleThemeChange = (event: MediaQueryListEvent) => {
    if (theme === 'system') {
      setTheme(event.matches ? 'dark' : 'light')
    }
  }
  useEffect(() => {
    getSystemTheme()
    if (darkModeMediaQuery) {
      darkModeMediaQuery.addEventListener('change', handleThemeChange)
    }
      
    return () => {
      darkModeMediaQuery && darkModeMediaQuery.removeEventListener('change', handleThemeChange)
    }
  }, [theme])
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className=' justify-center'>
          <div className=" size-10 cursor-pointer flex justify-center items-center">
            <span className={`iconify text-2xl ${icon}`}></span>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" sideOffset={10}>
        {options.map((item:GlobalOptions) => (
          <DropdownMenuItem onClick={() => onChange(item.value)} key={item.value}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default  SidebarFooter
