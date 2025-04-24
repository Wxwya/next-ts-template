"use client"
import React from 'react'
import createModal from '@/utils/modal'
// import { getVersion } from '@/api/system'
const testPromise = ()=> new Promise((resolve) => {
  setTimeout(() => {
    resolve("666")
  }, 2000)
})
export default function TestBnt() {
  const click = () => { 
    createModal({
     title: "666",
     children: "teste",
     confirm: async () => { 
       const res = await testPromise()
       console.log(res)
       return false
     }
   })
  }

  return (
    <div>
      <div onClick={click}>点击测试</div>
    </div>
  )
}
