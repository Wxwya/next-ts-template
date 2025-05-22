'use client'
import React, { useEffect, useMemo,useState } from 'react'
import XwyaForm, { type FormItemsProps } from '@/components/XwyaForm'
import XwyaTable, { type TableColumns } from '@/components/XwyaTable'
import useUserStore from '@/store/user'
import z from 'zod'
import { OptionsKeyEnums } from '@/enums/cacheEnums'
import { loadFormController } from '@/utils/handle'
import { Switch } from '@/rely/ui_rely'
import { changeDictStatus, getDictList, delDict } from '@/api/dict'
import usePage, { type PageType } from '@/hooks/use-page'
import XwyaButton from '@/components/XwyaButton'
import createModal from '@/utils/modal'
import { useParams } from 'next/navigation'
import DictForm from './dictForm'
const schema = z.object({
  dict_label: z.string().optional(),
  username: z.string().optional(),
  status: z.string().optional(),
})
const SubDict = () => {
  const { id: dict_type_id } = useParams()
  const { data, setData, page, setPage, loading, setLoading, total, setTotal,defaultPage } = usePage()
  const defaultOptions = useUserStore((state) => state.defaultOptions)
  const [ids, setIds] = React.useState<number[]>([])
  const [queryBody, setQueryBody] = useState<z.infer<typeof schema>>({})
  const items: FormItemsProps[] = useMemo(
    () => [
      { type: 'input', item: { label: '字典名称', name: 'dict_label' }, content: { placeholder: '请输入字典类型' } },
      { type: 'input', item: { label: '创建者', name: 'username' }, content: { placeholder: '请输入创建者' } },
      {
        type: 'select',
        item: { label: '状态', name: 'status' },
        content: { placeholder: '请选择状态', options: defaultOptions[OptionsKeyEnums.STATUS] || [] },
      },
    ],
    [defaultOptions]
  )
  const form = loadFormController(items, schema)
  const columns: TableColumns<Dict.DictInfo>[] = [
    {
      header: '字典名称',
      key: 'dict_label',
    },
    {
      header: '字典值',
      key: 'dict_value',
    },
    {
      header: '排序',
      key: 'order_num',
    },
    {
      header: '状态',
      key: 'status',
      cell: (row) => <Switch checked={row.status} onCheckedChange={(status) => onChangeStatus(row, status)}></Switch>,
    },
    {
      header: '创建者',
      key: 'username',
    },
    {
      header: '创建时间',
      key: 'create_time',
    },
    {
      header: '操作',
      key: 'id',
      cell: (row) => (
        <div className="flex gap-2 items-center">
          <span data-auth="xwya:dict:update" className=" text-blue-500 cursor-pointer" onClick={() => onOpen(row)}>
            编辑
          </span>
          <span data-auth="xwya:dict:delete" className=" text-red-500 cursor-pointer" onClick={() => onDelete(row)}>
            删除
          </span>
        </div>
      ),
    },
  ]
  const getData = async (newPage?: PageType) => {
    setLoading(true)
    const res = await getDictList({ ...page,...newPage,...queryBody,dict_type_id })
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
  const onChange = (pageNum: number, pageSize: number) => {
    getData({ pageNum, pageSize })
  }
  const onChangeStatus = async (row: Dict.DictInfo, status: boolean) => {
    const res = await changeDictStatus({ id: row.id!, status })
    if (res.code === 200) {
      getData()
    }
  }
  const onFinish = (values: z.infer<typeof schema>) => {
    setQueryBody(values)
  }
  const onReset = () => {
    form.reset()
    setQueryBody({})
  }
  const onOpen = (row?: Dict.DictInfo) => {
    const close = createModal({
      title: row ? '编辑配置' : '新增配置',
      children: <DictForm row={row} dictTypeId={dict_type_id as any} getData={getData} total={total} onClose={() => close?.()} />,
      footer: false,
    })
  }
  const onDelete = async (row?: Dict.DictInfo) => {
    createModal({
      title: '温馨提示',
      children: <div>确定要 {row ? <span className="text-red-600">删除{row?.dict_label}</span> : <span className="text-red-600">批量删除</span>} 类型吗？</div>,
      confirm: async () => {
        const res = await delDict(row ? [row.id!] : ids)
        if (res.code === 200) {
          getData()
          return true
        }
        return false
      },
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
      <XwyaForm labelWidth={60} labelAlign="right" items={items} form={form} onFinish={onFinish} row={6}>
        {
          <div className=" flex gap-2">
            <XwyaButton tooltipText="搜索" type="submit" icon="solar--magnifer-linear" />
            <XwyaButton tooltipText="重置" variant="outline" type="reset" onClick={onReset} icon="solar--refresh-linear" />
            <XwyaButton data-auth="xwya:dict:add" tooltipText="新增类型" className=" bg-blue-500 hover:bg-blue-600" type="button" onClick={() => onOpen()} icon="solar--add-circle-linear" />
            <XwyaButton data-auth="xwya:dict:delete" tooltipText="批量删除" type="button" variant="destructive" onClick={() => onDelete()} icon="solar--trash-bin-minimalistic-broken" />
          </div>
        }
      </XwyaForm>
      <XwyaTable flex select className="flex-1" onSelect={onSelect} data={data} page={page} total={total} loading={loading} onChange={onChange} columns={columns} />
    </div>
  )
}

export default SubDict
