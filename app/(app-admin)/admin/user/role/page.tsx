'use client'
import React, { useEffect, useState } from 'react'
import XwyaForm, { FormItemsProps } from '@/components/XwyaForm'
import { z } from 'zod'
import { loadFormController } from '@/utils/handle'
import usePage, { PageType } from '@/hooks/use-page'
import XwyaTable, { TableColumns } from '@/components/XwyaTable'
import XwyaButton from '@/components/XwyaButton'
import createModal from '@/utils/modal'
import { getRoleList, delRole } from '@/api/role'
import RoleForm from './roleForm'
const schema = z.object({
  role_name: z.string().optional(),
  description: z.string().optional(),
})
const RolePage = () => {
  const { data,setData,page,setPage,total,setTotal,loading,setLoading,defaultPage } = usePage<Role.RoleTableRow>()
  const [ids, setIds] = useState<number[]>([])
  const [queryBody, setQueryBody] = useState<z.infer<typeof schema>>({})
  const items:FormItemsProps[] = [
    { type: 'input',  item: { label: '角色名称', name: 'role_name',itemWidth:"260px", }, content: { placeholder: '请输入角色名称' } },
    { type: 'input',  item: { label: '描述', name: 'description',itemWidth:"260px" }, content: { placeholder: '请输入描述' } },
  ]
  const form = loadFormController(items, schema)
  const columns: TableColumns<Role.RoleTableRow>[] = [
    {
      header: '角色名称',
      key: 'role_name'
    },
    {
      header: '描述',
      key: 'description'
    },
    {
      header: "创建时间",
      key: "create_time"
    },
    {
      header: "操作",
      key: "role_id",
      cell: (row) => (<div className='flex items-center gap-2'>
        <span data-auth="xwya:role:update" className=' text-blue-500 cursor-pointer' onClick={()=>onOpen(row)}>编辑</span>
        <span data-auth="xwya:role:delete" className=' text-red-500 cursor-progress' onClick={()=>onDelete(row)}>删除</span>
      </div>)
    }
  ]

  const getData = async (newPage?: PageType) => {
    setLoading(true)
    const res = await getRoleList({ ...page,...newPage,...queryBody,})
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
  const onOpen = (row?:Role.RoleTableRow) => { 
    const close = createModal({
      title: row ? "编辑角色" : "新增角色",
      children: <RoleForm onClose={()=>close?.()} getData={getData} row={row} />,
      footer: false,
    })
  }
  const onDelete = async (row?: Role.RoleTableRow) => {
    createModal({
      title: "温馨提示",
      children: <div>确定要 {row ? <span className="text-red-600">删除{row?.role_name}</span> : <span className="text-red-600">批量删除</span>} 角色吗？</div>,
      confirm:async () => {
        const res = await delRole(row ? [row.role_id] : ids )
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
    <XwyaForm labelWidth={60} labelAlign="right" items={items} form={form} onFinish={onFinish} row={5}>
      {
        <div className=" flex gap-2">
          <XwyaButton tooltipText="搜索" type="submit" icon="solar--magnifer-linear" />
          <XwyaButton tooltipText="重置" variant="outline" type="reset" onClick={onReset} icon="solar--refresh-linear" />
          <XwyaButton data-auth="xwya:role:add" tooltipText="新增角色" className=" bg-blue-500 hover:bg-blue-600" type="button" onClick={() => onOpen()} icon="solar--add-circle-linear" />
          <XwyaButton data-auth="xwya:role:delete" tooltipText="批量删除"  type="button" variant="destructive" onClick={() => onDelete()} icon="solar--trash-bin-minimalistic-broken" />
        </div>
      }
    </XwyaForm>
    <XwyaTable flex select rowKey='role_id' className="flex-1" onSelect={onSelect} data={data} page={page} total={total} loading={loading} onChange={onChange} columns={columns} />
  </div>
  )
}

export default RolePage