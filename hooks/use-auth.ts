"use client";
import { isClient } from "@/utils";
import { useEffect } from "react"
import { usePathname } from "next/navigation";
import useUserStore from "@/store/user"
import { notFound } from "next/navigation";
import { generateRegex }from "@/utils/index"

function handelAuth(el: HTMLElement, permissions?: string[]) {
  let deleteEl: HTMLElement[] = []
  if (el.nodeType === 1 && el.hasAttribute('data-auth')) { 
    if (permissions && !permissions.includes(el.getAttribute("data-auth") as string)) { 
      deleteEl.push(el)
    }
    return deleteEl
  }
  if (el.childNodes.length) { 
    el.childNodes.forEach((child) => {
      if (child.nodeType === 1) {
        const deleteElChild = handelAuth(child as HTMLElement, permissions)
       deleteEl= [...deleteEl,...deleteElChild]   
      }
    })
  }
  return deleteEl
}

let observer: MutationObserver
const useAuth = () => {
  const pathname = usePathname()
  const globalPath = useUserStore((state) => state.globalPath)
  const userInfo = useUserStore((state) => state.userInfo)
  
  if (!observer && isClient() && userInfo) { 
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.nodeType === 1) {
          const deleteEl = handelAuth(mutation.target as HTMLElement,userInfo?.permissions)
          if (deleteEl.length) {
            deleteEl.forEach((el) => {
              el.remove()
            })
          }
        }
      })
    })
  } 
  
  const startObserver = () => { 
    const dom = document.querySelector(".auth-container")    
    const deleteEl = handelAuth(dom as HTMLElement,userInfo?.permissions)
    if (deleteEl.length) { 
      deleteEl.forEach((el) => {
        el.remove()
      })
    }
    observer.observe(dom as Node, {
      childList: true,
      subtree: true,
      attributes: true,
    })
  }
  const stopObserver = () => {
    observer &&  observer.disconnect()
  }
  useEffect(() => { 
    if(!userInfo) return
    startObserver()
    return () => {
      stopObserver()
    }
  }, [userInfo])
  useEffect(() => { 
    if(!globalPath.length) return 
    const flag = globalPath.some((path) => {
      const regex = generateRegex(path)
      return  (regex.test(pathname))
    })
    if (!flag) {
      notFound()
    }
  }, [pathname,globalPath])

}
export default useAuth
