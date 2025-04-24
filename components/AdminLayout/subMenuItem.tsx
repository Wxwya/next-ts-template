"use client";
import React, { useState,useEffect} from "react";
import {Collapsible,CollapsibleTrigger,CollapsibleContent} from "@/components/ui/collapsible";
import { SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton,  useSidebar } from "@/components/ui/sidebar";
import useSystemStore,{ onChangeMenuGroupKeys } from "@/store/system";
import { useRouter,usePathname } from "next/navigation";
import { isExternal } from "@/utils/vaildate";
import type {MenuStruct } from "./menu"

const SubMenuItem = ({path,title,icon,routes}: MenuStruct) => {
  const router = useRouter();
  const { open } = useSidebar();
  const pathname = usePathname();
  const menuGroupKeys = useSystemStore((state) => state.menuGroupKeys)
  const [selectedKey, setSelectedKey] = useState<string>("");
  const selectSubItemKey = (subPath: string) => {
    if (isExternal(subPath)) {
      window.open(subPath, "_blank");
      return
    }
    router.push(subPath);
  }
  const onOpenChange = () => { 
    onChangeMenuGroupKeys(path)
  }
  useEffect(() => { 
    const  pathurl= window.location.pathname;
    const result = pathurl.split('/').filter(Boolean)
    if (result.length > 2) {
      result.pop()
      onChangeMenuGroupKeys(result.join('/'))
    }
   setSelectedKey(pathurl)  
  },[pathname])
  return (
    <Collapsible open={menuGroupKeys.includes(path)} onOpenChange={onOpenChange}  className="group/collapsible">
      <SidebarMenuButton  tooltip={title}   asChild>
        <CollapsibleTrigger  className="w-full flex  justify-between items-center">
          <div className={`flex  items-center  gap-2 ${open?'gap-2':'gap-4'} `}>
            <div className=" flex  items-center justify-center">
            <span className={`iconify text-lg  ${icon}`}    />
            </div>
            <span>{title}</span>
          </div>
          <span className=" transition-transform iconify solar--alt-arrow-right-linear group-data-[state=open]/collapsible:rotate-90"></span>
        </CollapsibleTrigger>
      </SidebarMenuButton>
      <CollapsibleContent>
        <SidebarMenuSub>
          {routes?.map((item) => (
            <SidebarMenuSubItem key={item.path}>
              <SidebarMenuSubButton
                className=" cursor-pointer "
                isActive={item.path === selectedKey}
                onClick={() => selectSubItemKey(item.path)}
              >
                {item.title}
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
};
export default SubMenuItem;
