
export type MenuStruct = {
  path: string
  title: string
  icon?: string
  routes?: Omit<MenuStruct,"routes">[] 
}
export type BreadcrumbStruct = {
  type: "link" | "page",
  title:string,
  href: string,
}
export const menu: MenuStruct[] = [
  // {
  //   path: "/",
  //   title: "首页",
  //   icon: "solar--asteroid-bold-duotone",
  // },
  {
    path: "/admin/table",
    title: "表格示例",
    icon: "solar--asteroid-bold-duotone",
  },
  {
    path: "/admin/form",
    title: "表单示例",
    icon: "solar--asteroid-bold-duotone",
  },
  {
    path: "/admin/modal",
    title: "模态框示例",
    icon: "solar--asteroid-bold-duotone",
  },
  // {
  //   path: "/about",
  //   title: "关于我们",
  //   icon: "solar--danger-bold",
  // },
  // {
  //   path: "/form",
  //   title: "表单",
  //   icon: "solar--asteroid-bold-duotone",
  // },
  // {
  //   path: "/table",
  //   title: "表格",
  //   icon: "solar--asteroid-bold-duotone",
  // },
  
]

export const breadcrumbMap:Record<string,BreadcrumbStruct[]> = {
  "/admin/table": [
    {type:"page",title:"表格示例",href:"/admin/table"},
  ],
  "/admin/form": [
    {type:"page",title:"表单示例",href:"/admin/form"},
  ],

}