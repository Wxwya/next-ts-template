declare namespace Menu {
  interface MenuInfo {
    id: number
    parent_id: number
    title: string
    icon: string
    path: string
    sort: number
    hidden: boolean
    always_show: boolean
    status: boolean
    create_time: string
  }
  interface GetMenuListApi {
    list: MenuInfo[]
    total: number
  }
}
