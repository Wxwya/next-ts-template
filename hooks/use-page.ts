import { useState } from "react";

/***
 * 
 * @param pageSize  条数
 * 
 * @returns {page: {pageSize, pageNum}, total: number,loading: boolean,data:[]any}
 */
export type PageType = {
    pageSize: number,
    pageNum: number
}

const usePage = <T=any>(pageSize: number=10) => { 
  const [page, setPage] = useState<PageType>({
    pageSize,
    pageNum: 1
  })
  const defaultPage:PageType = {
    pageSize,
    pageNum: 1
}
  const [data,setData]= useState<T[]>([])
  const [total,setTotal]= useState<number>(0)
  const [loading,setLoading] = useState<boolean>(false)
  return {
    page,
    total,
    loading,
    data,
    setPage,
    setData,
    setTotal,
    setLoading,
    defaultPage
  }
}
export default usePage