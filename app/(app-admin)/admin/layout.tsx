
import React from 'react'
import AdminLayout from "@/components/AdminLayout"
import { redirect } from 'next/navigation'
import cache from '@/lib/cache';
import {  IsLogin } from "@/enums/cacheEnums"
import Auth from '@/components/Auth';
const userInfo ={
  "account": "admin",
  "create_time": "2025-04-25T10:00:00Z",
  "id": 1,
  "last_login_time": "2025-04-24T15:30:00Z",
  "permissions": [],
  "phone": "123-456-7890",
  "role_ids": [],
  "role_info": [],
  "routes": [],
  "status": true,
  "username": "admin"
}
export default async function Layout({ children }: { children: React.ReactNode }) {
  const isLogin = await cache.getCookie(IsLogin)
  if (!isLogin) { 
    redirect("/admin-login")
    return 
  }
  return (
    <AdminLayout info={userInfo}> 
      {children}
      <Auth />
    </AdminLayout>
  )
}
