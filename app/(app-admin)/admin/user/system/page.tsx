'use client'
import React, { useEffect, useMemo, useState } from 'react'
import XwyaForm, { FormItemsProps } from '@/components/XwyaForm'
import { z } from 'zod'
import { Switch } from '@/rely/ui_rely'
import useUserStore from '@/store/user'
import { getRoleOption } from "@/api/role"
import { OptionsKeyEnums } from '@/enums/cacheEnums'
import { loadFormController } from '@/utils/handle'
import { getUserList,changeUserStatus,delUser } from '@/api/user'
import usePage, { PageType } from '@/hooks/use-page'
import XwyaTable, { TableColumns } from '@/components/XwyaTable'
import XwyaButton from '@/components/XwyaButton'
import createModal from '@/utils/modal'
import UserForm from './userForm'
const schema = z.object({
  username: z.string().optional(),
  account: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  roles: z.array(z.number()).optional(),
  status: z.string().optional(),
})
const SystemUser = () => {
  const { data,setData,page,setPage,total,setTotal,loading,setLoading,defaultPage } = usePage<SystemUser.UserInfo>()
  const defaultOptions = useUserStore((state) => state.defaultOptions)
  const [rolesOptions, setRolesOptions] = useState<GlobalOptions<number>[]>([])
  const [ids, setIds] = useState<number[]>([])
  const [queryBody, setQueryBody] = useState<z.infer<typeof schema>>({})
  const items = useMemo<FormItemsProps[]>(() => [
    { type: 'input',  item: { label: '用户名', name: 'username',itemWidth:"260px", }, content: { placeholder: '请输入用户名' } },
    { type: 'input',  item: { label: '账号', name: 'account',itemWidth:"260px" }, content: { placeholder: '请输入账号' } },
    { type: 'input',  item: { label: "邮箱", name: "email",itemWidth:"260px" }, content: { placeholder: "请输入邮箱" } },
    { type: 'input', item: { label: "手机号", name: "phone",itemWidth:"260px" }, content: { placeholder: "请输入手机号" } },
    { type: 'multiSelect', item: { label: "角色", name: "roles",itemWidth:"260px" }, content: { placeholder: "请选择角色", options: rolesOptions } },
    { type: "select", item: { label: "状态", name: "status",itemWidth:"260px" }, content: { placeholder: "请选择状态", options: defaultOptions[OptionsKeyEnums.STATUS] || [] } },
  ], [defaultOptions, rolesOptions])
  const form = loadFormController(items, schema)
  const columns: TableColumns<SystemUser.UserInfo>[] = [
    {
      header: '名称',
      key: 'username'
    },
    {
      header: '账号',
      key: 'account'
    },
    {
      header: '邮箱',
      key: 'email'
    },
    {
      header: '手机号',
      key: 'phone'
    },
    {
      header: '角色',
      key: 'role_info',
      cell: (row) => <span>{row.role_info?.join(',')}</span>
    },
    {
      header: "状态",
      key: "status",
      cell: (row) => <Switch checked={row.status} onCheckedChange={(status)=>onChangeStatus(row,status)} />
    },
    {
      header: "创建时间",
      key: "create_time"
    },
    {
      header: "操作",
      key: "id",
      cell: (row) => (<div className='flex items-center gap-2'>
        <span data-auth='xwya:user:update' className=' text-blue-500 cursor-pointer' onClick={()=>onOpen(row)}>编辑</span>
        <span data-auth='xwya:user:delete' className=' text-red-500 cursor-progress' onClick={()=>onDelete(row)}>删除</span>
      </div>)
    }
  ]
  const getRolesOptions = async () => { 
    const res = await getRoleOption()
    if (res.code === 200) { 
      setRolesOptions(res.data!)
    }
  }
  const getData = async (newPage?: PageType) => {
    setLoading(true)
    const res = await getUserList({ ...page,...newPage,...queryBody,})
    if (res.code===200) { 
      setData(res.data!.userList)
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
  const onOpen = (row?:SystemUser.UserInfo) => { 
    const close = createModal({
      title: row ? "编辑用户" : "新增用户",
      children: <UserForm row={row} onClose={() => close?.()} options={rolesOptions} getData={getData} />,
      footer: false,
    })
  }
  const onDelete = async (row?: SystemUser.UserInfo) => {
    createModal({
      title: "温馨提示",
      children: <div>确定要 {row ? <span className="text-red-600">删除{row?.username}</span> : <span className="text-red-600">批量删除</span>} 用户吗？</div>,
      confirm:async () => {
        const res = await delUser(row ? [row.id] : ids )
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
  const onChangeStatus = async (row: SystemUser.UserInfo, status: boolean) => {
    const res = await changeUserStatus({ id: row.id, status })
    if (res.code === 200) {
      getData()
    }
  }
  useEffect(() => { 
    getRolesOptions()
  }, [])
  useEffect(() => { 
    getData(defaultPage)
  },[queryBody])

  return (
    <div className="h-full flex flex-col gap-4">
    <XwyaForm labelWidth={60} labelAlign="right" items={items} form={form} onFinish={onFinish} row={4} col={2}>
      {
        <div className=" flex gap-2">
          <XwyaButton tooltipText="搜索" type="submit" icon="solar--magnifer-linear" />
          <XwyaButton tooltipText="重置" variant="outline" type="reset" onClick={onReset} icon="solar--refresh-linear" />
          <XwyaButton data-auth="xwya:user:add" tooltipText="新增用户" className=" bg-blue-500 hover:bg-blue-600" type="button" onClick={() => onOpen()} icon="solar--add-circle-linear" />
          <XwyaButton data-auth="xwya:user:delete" tooltipText="批量删除"  type="button" variant="destructive" onClick={() => onDelete()} icon="solar--trash-bin-minimalistic-broken" />
        </div>
      }
    </XwyaForm>
    <XwyaTable flex select className="flex-1" onSelect={onSelect} data={data} page={page} total={total} loading={loading} onChange={onChange} columns={columns} />
  </div>
  )
}

export default SystemUser