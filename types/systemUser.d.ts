declare namespace SystemUser {
  interface Route {
    id: number
    parent_id: number
    title: string
    icon: string
    path: string
    sort: number
    hidden: boolean
    status: boolean
    create_time: string
    alwaysShow: boolean
    children?: Route[]
  }
  interface UserInfo {
    account: string
    create_time: string
    id: number
    last_login_time: string
    permissions: string[]
    phone: string
    role_ids: number[]
    role_info: string[]
    routes: Route[]
    status: boolean
    username: string
    email?:string
    avatar?:string
  }
  interface GetUserListApi {
    userList: SystemUser.UserInfo[]
    total: number
  }
}
