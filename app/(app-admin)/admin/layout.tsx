import React from 'react'
import AdminLayout from '@/components/AdminLayout'
import Auth from '@/components/Auth'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>
      {children}
      <Auth />
    </AdminLayout>
  )
}
