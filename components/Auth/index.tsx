"use client";
import useAuth from "@/hooks/use-auth";
import { useEffect } from "react";
import { onChangeUserInfo,onChangeDefaultOptions,onChangeMenus, onChangeGlobalPath } from '@/store/user'
import {getDefaultDict } from "@/api/system";
import { getUserInfo} from "@/api/user"
import path from "path";
let paths:string[] = ["/admin/form","/admin/table","/admin/modal"]
const Auth = () => {
  useAuth()
  const handleMenus = (routes:SystemUser.Route[]) => { 
   return routes
     .map((item) => {
      paths.push(path.join("/admin",item.path))
      if (item.hidden) return null // 如果 hidden，则不处理该项
      let p: MenuStruct = { path: path.join("/admin",item.path),icon:item.icon,title:item.title,routes:[] }
      if (item.children && item.children.length > 0) {
        if (!item.alwaysShow && item.children.length === 1) {
          const child = item.children[0]
            p.icon =child.icon
            p.title =child.title
            p.path = path.join("admin",child.path)
        } else {
          p.routes= handleMenus(item.children)
        }
      }
      return p
    })
    .filter(Boolean)  as MenuStruct[]
  }
  const getInfo = async () => { 
    // 获取用户信息
    const res = await getUserInfo()
    if (res.code === 200) { 
      onChangeUserInfo(res.data)
      const menus = handleMenus(res.data!.routes)
      onChangeGlobalPath(paths)
      onChangeMenus(menus)
    }
  }
  const getDefaultDictOption = async () => {
    const res = await getDefaultDict()
    if (res.code === 200) {
      const defaultOptions = res.data!.reduce((acc, item) => {
        const { type } = item;
        const keys = type.split(':');
        if (!acc[keys[keys.length-1]]) {
          acc[keys[keys.length-1]] = [];
        }
        acc[keys[keys.length-1]].push(item);
        return acc;
      }, {});
      onChangeDefaultOptions(defaultOptions)
    }
  }
  useEffect(() => { 
    getInfo()
    getDefaultDictOption()
    },[])
  return <></>
}
export default Auth;