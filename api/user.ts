import request from "@/lib/request"

export const generateUser = (data: any) => request.post({ url: "/systemUser/generate", method: "post", data }, {show:true})
export const getUserInfo = () => request.get<SystemUser.UserInfo>({ url: "/systemUser/info" })
export const delUser = (data: any) => request.post({ url: "/systemUser/delete", method: "post", data }, {show:true})
export const getUserList = (params: any) => request.get<SystemUser.GetUserListApi>({ url: "/systemUser/list", params })
export const changeUserStatus = (data: any) => request.post({url:"/systemUser/status",method:"post",data})
