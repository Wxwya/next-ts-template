"use client"
import React from 'react'
import createModal from '@/utils/modal'
export default function TestBnt() {
  const click = async () => { 
    createModal({
     title: "666",
     children: "teste",
     confirm: async () => { 
       return false
     }
   })
  }

  return (
    <div>
      <div onClick={click}>点击测试</div>
      <div data-auth="admin" suppressHydrationWarning>admin</div>
      <div data-auth="user" suppressHydrationWarning>user</div>
      <div data-auth="guest" suppressHydrationWarning>guest</div>
      <div data-auth="admin,user" suppressHydrationWarning>admin,user</div>
      <div data-auth="admin,guest" suppressHydrationWarning>admin,guest</div>
    </div>
  )
}
