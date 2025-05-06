'use client'
import React, { useEffect, useState } from 'react'
import XwyaForm, { FormItemsProps } from '@/components/XwyaForm'
import XwyaButton from '@/components/XwyaButton'
import { z } from 'zod'
import { loadFormController } from '@/utils/handle'
import usePage, { type PageType } from '@/hooks/use-page'
import XwyaTable, { type TableColumns } from '@/components/XwyaTable'
import { getDictTypeList, delDictType } from '@/api/dict'
import createModal from '@/utils/modal'
import DictTypeForm from './dictTypeForm'
import Link from 'next/link'
const schema = z.object({
  username: z.string().optional(),
  type_name: z.string().optional(),
})
const items: FormItemsProps[] = [
  { type: 'input', item: { label: '字典类型', name: 'type_name' }, content: { placeholder: '请输入字典类型' } },
  { type: 'input', item: { label: '创建者', name: 'username' }, content: { placeholder: '请输入创建者' } },
]
const DictPage = () => {
  const { data, loading, page, total, setData, setLoading, setPage, setTotal, defaultPage } = usePage()
  const form = loadFormController(items, schema)
  const [ids, setIds] = useState<number[]>([])
  const [queryBody, setQueryBody] = useState<z.infer<typeof schema>>({})
  const columns: TableColumns<Dict.DictTypeInfo>[] = [
    {
      header: '字典名称',
      key: 'dict_name',
      className: 'min-w-[100px]',
    },
    {
      header: '字典类型',
      key: 'type_name',
      className: 'min-w-[140px]',
    },
    {
      header: '是否系统默认',
      key: 'is_default',
      cell: (row) => (row.is_default === 'Y' ? '是' : '否'),
      className: 'min-w-[120px]',
    },
    {
      header: '备注',
      key: 'comment',
      className: 'min-w-[80px] truncate',
    },
    {
      header: '创建者',
      key: 'username',
      className: 'min-w-[80px]',
    },
    {
      header: '创建时间',
      key: 'create_time',
      className: 'min-w-[180px]',
    },
    {
      header: '操作',
      key: 'id',
      className: 'min-w-[180px]',
      cell: (row) => (
        <div className="flex gap-2 items-center">
          <span  data-auth="xwya:dict:update" className=" text-blue-500 cursor-pointer" onClick={() => onOpen(row)}>
            编辑
          </span>
          <Link data-auth="xwya:dict:data" className="text-blue-500 cursor-pointer" href={`/admin/system/subDict/${row.id}`}>
            字典配置
          </Link>
          <span data-auth="xwya:dict:delete" className="text-red-500 cursor-pointer" onClick={() => onDelete(row)}>
            删除
          </span>
        </div>
      ),
    },
  ]
  const getData = async (newPage?: PageType) => {
    setLoading(true)
    const res = await getDictTypeList({ ...page, ...newPage, ...queryBody })
    if (res.code === 200) {
      setData(res.data!.list)
      setTotal(res.data!.total)
      setPage({
        pageNum: newPage?.pageNum || page.pageNum,
        pageSize: newPage?.pageSize || page.pageSize,
      })
    }
    setLoading(false)
  }
  const onOpen = (row?: Dict.DictTypeInfo) => {
    const close = createModal({
      title: row ? '编辑字典类型' : '新增字典类型',
      children: <DictTypeForm row={row} onClose={() => close?.()} getData={getData} />,
      footer: false,
    })
  }
  const onDelete = async (row?: Dict.DictTypeInfo) => {
    createModal({
      title: '温馨提示',
      children: <div>确定要 {row ? <span className="text-red-600">删除{row?.dict_name}</span> : <span className="text-red-600">批量删除</span>} 字典吗？</div>,
      confirm: async () => {
        const res = await delDictType(row ? [row.id] : ids)
        if (res.code === 200) {
          getData()
          return true
        }
        return false
      },
    })
  }
  const onFinish = (values: z.infer<typeof schema>) => {
    setQueryBody(values)
  }
  const onReset = () => {
    form.reset()
    setQueryBody({})
  }
  const onChange = (pageNum: number, pageSize: number) => {
    getData({ pageNum, pageSize })
  }
  const onSelect = (ids: number[], _) => {
    setIds(ids)
  }
  useEffect(() => {
    getData(defaultPage)
  }, [queryBody])
  return (
    <div className="h-full flex flex-col gap-4">
      <XwyaForm labelWidth={60} labelAlign="right" items={items} form={form} onFinish={onFinish} row={6}>
        {
          <div className=" flex gap-2">
            <XwyaButton tooltipText="搜索" type="submit" icon="solar--magnifer-linear" />
            <XwyaButton tooltipText="重置" variant="outline" type="reset" onClick={onReset} icon="solar--refresh-linear" />
            <XwyaButton data-auth="xwya:dict:add" tooltipText="新增字典" className=" bg-blue-500 hover:bg-blue-600" type="button" onClick={() => onOpen()} icon="solar--add-circle-linear" />
            <XwyaButton  data-auth="xwya:dict:delete" tooltipText="批量删除" type="button" variant="destructive" onClick={() => onDelete()} icon="solar--trash-bin-minimalistic-broken" />
          </div>
        }
      </XwyaForm>
      <XwyaTable flex select className="flex-1" onSelect={onSelect} data={data} page={page} total={total} loading={loading} onChange={onChange} columns={columns} />
    </div>
  )
}

export default DictPage
