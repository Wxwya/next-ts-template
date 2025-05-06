'use client'
import React, { useEffect,  useState } from 'react'
import XwyaForm, { FormItemsProps } from '@/components/XwyaForm'
import { z } from 'zod'
import { loadFormController } from '@/utils/handle'
import usePage, { PageType } from '@/hooks/use-page'
import XwyaTable, { TableColumns } from '@/components/XwyaTable'
import XwyaButton from '@/components/XwyaButton'
import createModal from '@/utils/modal'
import PermissionModal from '@/components/permissionModal'
import Link from 'next/link'
import { delPermissions,getPermissionsList } from '@/api/permissions'
const schema = z.object({
  permission_name: z.string().optional(),
  description: z.string().optional(),
})

const PermissionsPage = () => {
  const { data,setData,page,setPage,total,setTotal,loading,setLoading,defaultPage } = usePage<Permissions.PermissionsInfo>()
  const [ids, setIds] = useState<number[]>([])
  const [queryBody, setQueryBody] = useState<z.infer<typeof schema>>({})
  const items:FormItemsProps[] = [
    { type: 'input',  item: { label: '权限名称', name: 'permission_name',itemWidth:"260px", }, content: { placeholder: '请输入权限名称' } },
    { type: 'input',  item: { label: '权限描述', name: 'description',itemWidth:"260px" }, content: { placeholder: '请输入权限描述' } },
  ]
  const form = loadFormController(items, schema)
  const columns: TableColumns<Permissions.PermissionsInfo>[] = [
    {
      header: '权限名称',
      key: 'permission_name'
    },
    {
      header: '权限描述',
      key: 'description'
    },
    {
      header: "创建时间",
      key: "create_time"
    },
    {
      header: "操作",
      key: "permission_id",
      cell: (row) => (<div className='flex items-center gap-2'>
        <span data-auth='xwya:permission:update' className=' text-blue-500 cursor-pointer' onClick={() => onOpen(row)}>编辑</span>
        <Link href={`/admin/user/buttonPermissions/${row.permission_id}/${row.permission_name}`} data-auth='xwya:permission:bnt' className=' text-blue-500 cursor-pointer' >按钮权限管理</Link>
        <span data-auth='xwya:permission:delete' className=' text-red-500 cursor-progress' onClick={()=>onDelete(row)}>删除</span>
      </div>)
    }
  ]

  const getData = async (newPage?: PageType) => {
    setLoading(true)
    const res = await getPermissionsList({ ...page,...newPage,...queryBody,})
    if (res.code===200) { 
      setData(res.data!.list)
      setTotal(res.data!.total)
      setPage({
        pageNum: newPage?.pageNum || page.pageNum,
        pageSize: newPage?.pageSize || page.pageSize
      })
    }
    setLoading(false)
  }
  const onChange = (pageNum: number, pageSize: number) => { 
    getData({  pageNum, pageSize })
  }
  const onFinish = (value: z.infer<typeof schema>) => {
    setQueryBody(value)
  }
  const onReset = () => { 
    form.reset()
    setQueryBody({})
  }
  const onOpen = (row?:Permissions.PermissionsInfo) => { 
    const close = createModal({
      title: row ? "编辑权限" : "新增权限",
      children: <PermissionModal  row={row} onClose={() => close?.()}  getData={getData}   />,
      footer: false,
    })
  }
  const onDelete = async (row?: Permissions.PermissionsInfo) => {
    createModal({
      title: "温馨提示",
      children: <div>确定要 {row ? <span className="text-red-600">删除{row?.permission_name}</span> : <span className="text-red-600">批量删除</span>} 权限吗？</div>,
      confirm:async () => {
        const res = await delPermissions(row ? [row.permission_id] : ids )
        if (res.code === 200) {
          getData()
          return true
        }
        return false
      }
    })
  }
  const onSelect = (ids: number[], _) => {
    setIds(ids)
  }

  useEffect(() => { 
    getData(defaultPage)
  },[queryBody])

  return (
    <div className="h-full flex flex-col gap-4">
    <XwyaForm labelWidth={60} labelAlign="right" items={items} form={form} onFinish={onFinish} row={5} >
      {
        <div className=" flex gap-2">
          <XwyaButton tooltipText="搜索" type="submit" icon="solar--magnifer-linear" />
          <XwyaButton tooltipText="重置" variant="outline" type="reset" onClick={onReset} icon="solar--refresh-linear" />
          <XwyaButton data-auth="xwya:permission:add" tooltipText="新增权限" className=" bg-blue-500 hover:bg-blue-600" type="button" onClick={() => onOpen()} icon="solar--add-circle-linear" />
          <XwyaButton data-auth="xwya:permission:delete" tooltipText="批量删除"  type="button" variant="destructive" onClick={() => onDelete()} icon="solar--trash-bin-minimalistic-broken" />
        </div>
      }
    </XwyaForm>
    <XwyaTable rowKey='permission_id' flex select className="flex-1" onSelect={onSelect} data={data} page={page} total={total} loading={loading} onChange={onChange} columns={columns} />
  </div>
  )
}

export default PermissionsPage