
'use client'
import React, { useEffect } from 'react'
import cache from '@/lib/cache'
import { VERSION } from "@/enums/cacheEnums"
import createModal from '@/utils/modal'
import { isClient } from '@/utils'
import { toast} from "react-hot-toast"
let v:any = isClient() && cache.getLocalStorage(VERSION)
let timer: any = null
let isModal = false
const TIME_DATE = 1000 * 60 * 30
const Version = () => {
  const getVersion = async () => {
    try {
      const res = await fetch('/version.json', { cache: 'no-store' })
      const data = await res.json()
      if (!v) { 
        cache.setLocalStorage(VERSION, data.version)
        v = data.version
      }
      if (data.version !== v) {
        if (!isModal) { 
          createModal({
            title: "版本更新",
            children: "检测到版本更新，请刷新页面~~",
            confirm: () => {
              if (isClient()) { 
                cache.setLocalStorage(VERSION, data.version)
                location.reload()
              }
            },
            contentProps: {
              className:"[&>button]:hidden", // 隐藏按钮
              onInteractOutside:(e) => e.preventDefault(), // 禁止点击遮罩关闭
              onEscapeKeyDown:(e) => e.preventDefault(),  // （可选）禁用 ESC 关闭
            },
         
            isCancelBnt:false
          })
          isModal = true
        }
       
      }
     } catch (err) { 
      toast.error(`版本更新失败:${JSON.stringify(err)}`)
    }

  }
  const loop = () => {
    getVersion()
    timer= setInterval(() => {
      getVersion()
    }, TIME_DATE)
  }
  useEffect(() => { 
    loop()
    return () => {
      timer && clearInterval(timer)
    }
  },[])
  return (
   <></>
  )
}

export default Version