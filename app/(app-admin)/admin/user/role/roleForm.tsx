import React, { useEffect, useMemo, useState } from 'react'
import { loadFormController } from '@/utils/handle'
import z from 'zod'
import XwyaForm, { type FormItemsProps } from '@/components/XwyaForm'
import { Button } from '@/rely/ui_rely'
import { generateRole,getRoleInfo } from '@/api/role'
import { getMenuOptions  } from "@/api/menu";
import { getPermissionsOptions } from "@/api/permissions";
type FormPorps = {
  row?: Role.RoleTableRow
  onClose: () => void
  getData:Function
}
const RoleForm = (props: FormPorps) => {
  const { row, onClose, getData } = props
  const [menuOptions, setMenuOptions] = useState<TreeOptions[]>([])
  const [permissionsOptions, setPermissionsOptions] = useState<TreeOptions[]>([])
  const schema = z.object({
    role_name: z.string().nonempty({ message: '角色名称不能为空' }),
    description: z.string().nonempty({ message: '角色描述不能为空' }),
    menu_ids: z.array(z.number()).optional(),
    permissions_ids: z.array(z.number()).optional(),
  })
  const items: FormItemsProps[] = useMemo(() => [
    { type: 'input', item: { label: '角色名称', name: 'role_name' }, content: {placeholder: '请输入角色名称',}},
    { type: 'input',item: { label: '角色描述', name: 'description' }, content: {placeholder: '请输入角色描述'} },
    {type: 'tree',item: { label:"菜单配置",name:"menu_ids" },content: {placeholder:"请输入菜单",options:menuOptions}},
    { type: "tree", item: { label: "权限配置", name: "permissions_ids" }, content: { placeholder:"请选择权限",options:permissionsOptions}},
  ],[menuOptions,permissionsOptions]) 
  const form = loadFormController(items, schema)
  const onLoadRoleInfo = async () => { 
    const res = await getRoleInfo(row!.role_id)
    if (res.code === 200) { 
      setTimeout(() => {
        form.reset({
              ...res.data
        })
      },0)
    }
  }
  const onLoadMenuOptions = async () => {
    const res = await getMenuOptions()
    if (res.code === 200) {
      setMenuOptions(res.data!)
    }
   }
  const onLoadPermissionsOptions = async () => { 
    const res = await getPermissionsOptions()
    if (res.code === 200) {
      setPermissionsOptions(res.data!)
      }
  }
  const onFinish = async (values: z.infer<typeof schema>) => {
    const res = await generateRole({ ...values,role_id: row?.role_id })
    if (res.code === 200) {
      getData()
      onClose()
    }
  }
  useEffect(() => { 
    onLoadMenuOptions()
    onLoadPermissionsOptions()
    if (row) { 
      onLoadRoleInfo()
     }
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

export default RoleForm