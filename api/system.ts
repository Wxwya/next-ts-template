import request from "@/lib/request"
export const uploadFile = (file: FormData) => request.uploadFile<{ url: string }>({ url: "/system/upfile", file })
// export const getVersion = () => request.get<any>({ url: "/version.json",cache:"no-store" })