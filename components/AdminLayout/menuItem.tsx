"use client";
import React, { useEffect,useState } from "react";
import { isExternal } from "@/utils/vaildate";
import { useRouter,usePathname } from "next/navigation";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { MenuStruct } from "./menu";
// let iconActiveColor = "#0ABD52"
// let iconDefaultColor = "#8F9BB3"
const MenuItem = ({ title, icon,path }: MenuStruct) => {
  const pathname = usePathname()
  const [selectedKey,setSelectedKey] = useState("")
  const router = useRouter();
  const toPage = () => { 
    if (isExternal(path)) {
      window.open(path, "_blank");
      return
    }
    router.push(path)
  }
  useEffect(() => { 
    setSelectedKey(window.location.pathname)
  },[pathname])
  return (
    <div>
      <SidebarMenuItem>
        <SidebarMenuButton className="" tooltip={title} asChild   isActive={path === selectedKey} >
          <div onClick={toPage} className="cursor-pointer  ">
            <div className=" flex items-center  justify-center ">
             <div className={`iconify  text-lg ${icon}` } ></div>
            </div>
            <span>{title}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </div>
  );
};
export default MenuItem;
