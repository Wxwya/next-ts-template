'use client'
import React, { useEffect } from 'react'
import { getLogList } from '@/api/system'
import XwyaTable, { type TableColumns} from '@/components/XwyaTable';
import usePage, { PageType } from '@/hooks/use-page';
const LogPage = () => {
  const { data, setData, loading, setLoading, total, setTotal, page, setPage } = usePage<Log.LoggerInfo>(10)
  const columns: TableColumns<Log.LoggerInfo>[] = [
    {
      key: "id",
      header: "序号",
      className:"min-w-20"
    },
    {
      key: "status_code",
      header: "状态码",
      className: "min-w-20",
    },
    {
      key: "ip",
      header: "ip地址",
      className: "min-w-28",
    },
    {
      key: "method",
      header: "请求方法",
      className:"min-w-24"
    },
    {
      key: "path",
      header: "请求地址",
      className:"min-w-40 truncate",
    },
    {
      key: "error_content",
      header: "错误信息",
      className: "max-w-[500px] max-w-[700px] truncate",
      tooltip: true,
      sort:true
    },
    {
      key: "file",
      header: "错误文件",
      className:"min-w-40 truncate",
    },
    {
      key: "line",
      header: "错误行",
      className:"min-w-20",
    },
    {
      key: "create_time",
      header: "发生时间",
      className:"min-w-40",
    },
   
  ]
  const getData = async (newPage?: PageType) => { 
    setLoading(true)
    const res = await getLogList({ ...page,...newPage })
    if (res.code === 200) { 
      setData(res.data!.list)
      setTotal(res.data!.total)
      setPage({...page,...newPage})
    }
    setLoading(false)
  }
  const onChange = (pageNum: number, pageSize: number) => {
    getData({ pageNum, pageSize })
  }
  useEffect(() => { 
    getData()
  },[])
  return (
    <XwyaTable  flex  data={data} page={page} total={total} loading={loading}  onChange={onChange} columns={columns} />
  )
}

export default LogPage