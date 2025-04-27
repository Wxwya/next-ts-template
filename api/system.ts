import request from "@/lib/request"
export const uploadFile = (file: FormData) => request.uploadFile<{ url: string }>({ url: "/system/upfile", file })
// export const login = (data: any) => request.post<any>({ url: "/system/login", data })
// export const getDict = () => request.get<any>({ url: "/dict/default" })
// export const getUserInfo = () => request.get<any>({ url: "/systemUser/info" })