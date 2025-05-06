import request from "@/lib/request"
export const generatePermissions = (data: any) => request.post({ url: '/permissions/generate', data })
export const getPermissionsInfo = (id: any) => request.get < Permissions.PermissionsInfo>({ url: `/permissions/info/${id}` })
export const getPermissionsList = (params: any) => request.get<Permissions.GetPermissionsListApi>({ url: '/permissions/list', params })
export const getPermissionsOptions = () => request.get<TreeOptions[]>({ url: '/permissions/options' })
export const delPermissions = (data: any) => request.post({ url: '/permissions/delete', data })
