'use client'
import React, { useEffect, useMemo, useState } from 'react'
import XwyaForm, { FormItemsProps } from '@/components/XwyaForm'
import { z } from 'zod'
import { Switch } from '@/rely/ui_rely'
import useUserStore from '@/store/user'
import { OptionsKeyEnums } from '@/enums/cacheEnums'
import { loadFormController } from '@/utils/handle'
import { delMenu,getMenuList,changeMenuStatus } from '@/api/menu'
import usePage, { PageType } from '@/hooks/use-page'
import XwyaTable, { TableColumns } from '@/components/XwyaTable'
import XwyaButton from '@/components/XwyaButton'
import createModal from '@/utils/modal'
import MenuModal from '@/components/MenuModal'
import { useParams } from 'next/navigation'
const schema = z.object({
  title: z.string().optional(),
  path: z.string().optional(),
  status: z.string().optional(),
})

const SubMenu = () => {
  const { id:parent_id, prefix} = useParams()
  const { data,setData,page,setPage,total,setTotal,loading,setLoading,defaultPage } = usePage<Menu.MenuInfo>()
  const defaultOptions = useUserStore((state) => state.defaultOptions)
  const [ids, setIds] = useState<number[]>([])
  const [queryBody, setQueryBody] = useState<z.infer<typeof schema>>({})
  const items = useMemo<FormItemsProps[]>(() => [
    { type: 'input',  item: { label: '菜单名称', name: 'title',itemWidth:"260px", }, content: { placeholder: '请输入菜单名称' } },
    { type: 'input',  item: { label: '菜单路径', name: 'path',itemWidth:"260px" }, content: { placeholder: '请输入账号' } },
    { type: "select", item: { label: "状态", name: "status",itemWidth:"260px" }, content: { placeholder: "请选择状态", options: defaultOptions[OptionsKeyEnums.STATUS] || [] } },
  ], [defaultOptions])
  const form = loadFormController(items, schema)
  const columns: TableColumns<Menu.MenuInfo>[] = [
    {
      header: '菜单名称',
      key: 'title'
    },
    {
      header: '菜单路径',
      key: 'path'
    },
    {
      header: '菜单图标',
      key: 'icon'
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
        <span data-auth='xwya:menu:update' className=' text-blue-500 cursor-pointer' onClick={() => onOpen(row)}>编辑</span>
        <span data-auth='xwya:menu:delete' className=' text-red-500 cursor-progress' onClick={()=>onDelete(row)}>删除</span>
      </div>)
    }
  ]

  const getData = async (newPage?: PageType) => {
    setLoading(true)
    const res = await getMenuList({ ...page,...newPage,...queryBody,parent_id,})
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
  const onOpen = (row?:Menu.MenuInfo) => { 
    const close = createModal({
      title: row ? "编辑子菜单" : "新增子菜单",
      children: <MenuModal row={row} prefix={prefix as string} onClose={() => close?.()} parent_id={parent_id as string}  getData={getData} total={total}  />,
      footer: false,
    })
  }
  const onDelete = async (row?: Menu.MenuInfo) => {
    createModal({
      title: "温馨提示",
      children: <div>确定要 {row ? <span className="text-red-600">删除{row?.title}</span> : <span className="text-red-600">批量删除</span>} 菜单吗？</div>,
      confirm:async () => {
        const res = await delMenu(row ? [row.id] : ids )
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
  const onChangeStatus = async (row: Menu.MenuInfo, status: boolean) => {
    const res = await changeMenuStatus({ id: row.id, status })
    if (res.code === 200) {
      getData()
    }
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
          <XwyaButton data-auth="xwya:menu:add" tooltipText="新增菜单" className=" bg-blue-500 hover:bg-blue-600" type="button" onClick={() => onOpen()} icon="solar--add-circle-linear" />
          <XwyaButton data-auth="xwya:menu:delete" tooltipText="批量删除"  type="button" variant="destructive" onClick={() => onDelete()} icon="solar--trash-bin-minimalistic-broken" />
        </div>
      }
    </XwyaForm>
    <XwyaTable flex select className="flex-1" onSelect={onSelect} data={data} page={page} total={total} loading={loading} onChange={onChange} columns={columns} />
  </div>
  )
}

export default SubMenu