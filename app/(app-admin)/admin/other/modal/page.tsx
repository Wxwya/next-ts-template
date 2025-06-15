"use client"
import createModal from "@/utils/modal"
import XwyaTooltip from "@/components/XwyaTooltip"
const onTest = ():Promise<boolean> => {
   return new Promise((resolve) => {
     setTimeout(() => {
       resolve(true)
     }, 5000)
   })
}
export default function Modal() {
  const click = async () => { 
    createModal({
     title: "666",
     children: "teste",
     confirm: async () => { 
       return await onTest()
     }
   })
  }
  return (
    <div>
      <div onClick={click} className="">点击测试</div>
      {/* <XwyaEmoji /> */}
      <XwyaTooltip text="test">
          6666
      </XwyaTooltip>
    </div>
  )
}
