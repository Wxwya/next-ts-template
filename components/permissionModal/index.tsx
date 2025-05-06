import React, { useEffect } from 'react'
import { loadFormController } from '@/utils/handle'
import z from 'zod'
import XwyaForm, { type FormItemsProps } from '@/components/XwyaForm'
import { Button } from '@/rely/ui_rely'
import { generatePermissions } from '@/api/permissions'
import { toast } from 'react-hot-toast'
type FormPorps = {
  row?: Permissions.PermissionsInfo
  onClose: () => void
  getData: Function
  prefix?: string
  parent_id?: number|string
}
const schema = z.object({
  permission_name: z.string().nonempty({ message: '权限名称不能为空' }),
  description: z.string().nonempty({ message: '权限描述不能为空' }),
})
const PermissionModal = (props: FormPorps) => {
  const { row = {} as Permissions.PermissionsInfo, onClose, getData, prefix, parent_id=0 } = props

  const items: FormItemsProps[] =[
    { type: 'input', item: { label: '权限名称', name: 'permission_name' }, content: {placeholder: '请输入权限名称',}},
    { type: 'input', item: { label: '权限描述', name: 'description' }, content: { placeholder: '请输入权限描述' } },
  ]
 const form = loadFormController(items, schema)
  const onFinish = async (values: z.infer<typeof schema>) => {
    if (parent_id) {
      if (values.permission_name.startsWith(prefix as string)) {
        toast.error('前缀缺少' + prefix)
        return
      }
    }
      if (values.permission_name == decodeURIComponent(prefix as string)  ) { 
        toast.error('请输入格式'+ decodeURIComponent(prefix as string ) + ':xxx')
        return
      }
    const res = await generatePermissions({ ...values,parent_id: Number(parent_id) })
    if (res.code === 200) {
      getData()
      onClose()
    }
  }
  useEffect(() => { 
      form.reset({
        ...row,
        permission_name: row?.permission_name?row?.permission_name:prefix?decodeURIComponent(prefix):''
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

export default PermissionModal