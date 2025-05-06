import React, { useEffect } from 'react'
import { loadFormController } from '@/utils/handle'
import z from 'zod'
import XwyaForm, { type FormItemsProps } from '@/components/XwyaForm'
import { Button } from '@/rely/ui_rely'
import { generateMenu } from "@/api/menu";
import { toast } from 'react-hot-toast'
type FormPorps = {
  row?: Menu.MenuInfo
  onClose: () => void
  getData: Function
  prefix?: string
  parent_id?: number|string
  total?: number
}
const MenuModal = (props: FormPorps) => {
  const { row = {} as Menu.MenuInfo, onClose, getData, prefix, parent_id=0, total } = props
  const schema = z.object({
    title: z.string().nonempty({ message: '菜单名称不能为空' }),
    icon: z.string().optional(),
    path: z.string().nonempty({ message: '菜单路径不能为空' }),
    sort: z.string().nonempty({ message: '菜单排序不能为空' }),
    hidden: z.boolean().optional(),
    always_show: z.boolean().optional()
  })
  const items: FormItemsProps[] =[
    { type: 'input', item: { label: '菜单名称', name: 'title' }, content: {placeholder: '请输入菜单名称',}},
    { type: 'input', item: { label: '菜单图标', name: 'icon' }, content: { placeholder: '请输入菜单图标' } },
    { type: 'input', item: { label: '菜单路径', name: 'path' }, content: { placeholder: '请输入菜单路径' } },
    { type: 'input', item: { label: '排序', name: 'sort' }, content: { placeholder: '请输入菜单排序' } },
    { type: 'switch', item: { label: '是否隐藏', name: 'hidden' } },
    ...(!props.parent_id?[{type:'switch',item:{label:'总是显示', name:'always_show'}}] as FormItemsProps[]:[])
    ,
  ]
 const form = loadFormController(items, schema)
  const onFinish = async (values: z.infer<typeof schema>) => {
    if (parent_id) {
      if (values.path.startsWith(prefix as string)) {
        toast.error('路径前缀缺少' + prefix)
        return
      }
    }
      if (values.path == prefix) { 
        toast.error('请输入二级路由路径')
        return
      }
    const res = await generateMenu({ ...values,sort: Number(values.sort),parent_id: Number(parent_id) })
    if (res.code === 200) {
      getData()
      onClose()
    }
  }
  useEffect(() => { 
      form.reset({
        ...row,
        sort: row?.sort ? row.sort.toString() : (total! + 1).toString(),
        path: row?.path?row?.path:prefix?'/'+prefix:''
      })
  },[])
  return (
    <XwyaForm labelWidth={80} form={form} items={items} row={1} onFinish={onFinish}>
    <div className="w-full flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onClose}>
        取消
      </Button>
      <Button type="submit">确认</Button>
    </div>
  </XwyaForm>
  )
}

export default MenuModal