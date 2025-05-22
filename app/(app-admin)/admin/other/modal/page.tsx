"use client"
import createModal from "@/utils/modal"
import XwyaEmoji from "@/components/XwyaEmoji"
export default function Modal() {
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
      <div onClick={click} className="">点击测试</div>
      <XwyaEmoji />
    </div>
  )
}
