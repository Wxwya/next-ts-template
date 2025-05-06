import request from "@/lib/request"

export const getDictList = (params: any) => request.get<Dict.GetDictListStructApi>({ url: "/dict/dictlist", params })
export const getDictInfo = (id: any) => request.get<Dict.DictInfo>({ url: `/dict/dictinfo/${id}` })
export const generateDict = (data: any) => request.post({ url: "/dict/generateDict", data }, {show:true})
export const delDict = (data: any) => request.post({ url: "/dict/deleteDict",  data })
export const getDictType = (type: string) => request.get<GlobalOptions[]>({ url: `/dict/${type}` })
export const getDictTypeList = (params: any) => request.get<Dict.GetDictTypeListStructApi>({ url: "/dict/dictTypeList",  params })
export const delDictType = (data: any) => request.post({ url: "/dict/deleteDictType",  data },{show:true})
export const generateDictType = (data: any) => request.post({ url: "/dict/generateDictType", data }, {show:true})
export const changeDictStatus = (data: any) => request.post({ url: "/dict/changeStatus", data }, { show: true })
export const getDefaultDiceOptions = () => request.get<DefaultOptions[]>({url:"/dict/default"})