

export type BreadcrumbStruct = {
  type: "link" | "page",
  title:string,
  href: string,
}
// solar--user-bold solar--settings-bold
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
  "/admin/modal": [
    {type:"page",title:"模态框示例",href:"/admin/modal"},
  ],
  "/admin/user/system": [
    { type: "page", title: "用户管理", href: "/admin/user" },
    { type: "page", title: "企业端用户管理", href: "/admin/user/system" },
  ],
  "/admin/user/client": [
    { type: "page", title: "用户管理", href: "/admin/user" },
    { type: "page", title: "客户端用户管理", href: "/admin/user/client" },
  ],
  "/admin/user/role": [
    { type: "page", title: "用户管理", href: "/admin/user" },
    { type: "page", title: "角色管理", href: "/admin/user/role" },
  ],
  "/admin/user/permissions": [
    { type: "page", title: "用户管理", href: "/admin/user" },
    { type: "page", title: "权限管理", href: "/admin/user/permissions" },
  ],
  "/admin/user/menu": [
    { type: "page", title: "用户管理", href: "/admin/user" },
    { type: "page", title: "菜单管理", href: "/admin/user/menu" },
  ],
  "/admin/system/dict": [
    { type: "page", title: "系统设置", href: "/admin/system" },
    { type: "page", title: "字典管理", href: "/admin/system/dict" },
  ],
  "/admin/system/log": [
    { type: "page", title: "系统设置", href: "/admin/system" },
    { type: "page", title: "日志管理", href: "/admin/system/log" },
  ]
}