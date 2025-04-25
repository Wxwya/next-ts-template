import { isClient } from "@/utils";
import { useEffect } from "react"

function handelAuth(el: HTMLElement) {
  let deleteEl:HTMLElement[] = []
  if (el.nodeType===1 && el.hasAttribute('data-auth')) { 
    if (!el.getAttribute("data-auth")?.includes("admin")) { 
      deleteEl.push(el)
    }
    return deleteEl
  }
  if (el.childNodes.length) { 
    el.childNodes.forEach((child) => {
      // console.log(child);
      
      if (child.nodeType === 1) {
        const deleteElChild = handelAuth(child as HTMLElement)
       deleteEl= [...deleteEl,...deleteElChild]   
      }
    })
  }
  return deleteEl
}

let observer: MutationObserver
const useAuth = () => {
  if(observer || !isClient()) return 
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.nodeType === 1) {
        const deleteEl = handelAuth(mutation.target as HTMLElement)
        if (deleteEl.length) {
          deleteEl.forEach((el) => {
            el.innerHTML = ""
          })
        }
      }
    })
  })
  const startObserver = () => { 
    const dom = document.querySelector(".auth-container")
    const deleteEl = handelAuth(dom as HTMLElement)
    if (deleteEl.length) { 
      deleteEl.forEach((el) => {
        el.innerHTML = ""
      })
    }
    observer.observe(dom as Node, {
      childList: true,
      subtree: true,
    })
  }
  const stopObserver = () => {
    observer &&  observer.disconnect()
  }
  useEffect(() => { 
    startObserver()
    return () => {
      stopObserver()
    }
  },[])
}
export default useAuth
