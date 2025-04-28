import request from "@/lib/request"
export const generateRole = (data: any) => request.post({ url: '/role/generate', data })
export const getRoleInfo = (id: any) => request.get<Role.RoleInfo>({ url: `/role/info/${id}` })
export const getRoleList = (params: any) => request.get<Role.GetRoleListApi>({ url: '/role/list', params })
export const getRoleOption = () => request.get<GlobalOptions<number>[]>({ url: '/role/options' })
export const delRole = (data: any) => request.post({ url: '/role/delete', data })
