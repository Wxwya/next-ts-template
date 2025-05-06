import React, { useEffect } from 'react'
import { loadFormController } from '@/utils/handle'
import z from 'zod'
import XwyaForm, { type FormItemsProps } from '@/components/XwyaForm'
import { Button } from '@/rely/ui_rely'
import { generateUser } from '@/api/user'
type UserFormPorps = {
  options: GlobalOptions<number>[]
  row?: SystemUser.UserInfo
  onClose: () => void
  getData:Function
}
const UserForm = (props: UserFormPorps) => {
  const { options, row, onClose, getData } = props
  const schema = z.object({
    username: z.string().nonempty({ message: '用户名不能为空' }),
    account: z.string().nonempty({ message: '账号不能为空' }),
    email: z.string().email({ message: '邮箱格式不正确' }),
    phone: z.string().regex(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/, { message: '手机号格式不正确' }),
    password: row ? z.string().optional() : z.string().min(6, { message: '密码不能少于6位' }),
    role_ids:z.array(z.number()).nonempty({ message: '角色不能为空' })
  })
  const items: FormItemsProps[] = [
    { type: 'input', item: { label: '用户名', name: 'username' }, content: {placeholder: '请输入用户名',}},
    { type: 'input',item: { label: '账号', name: 'account' }, content: {placeholder: '请输入账号'} },
    { type: 'input',item: { label: "邮箱", name: "email" }, content: {placeholder: "请输入邮箱",} },
    { type: 'input',item: { label: "手机号", name: "phone" }, content: {placeholder: "请输入手机号",}},
    {type: 'input',item: { label:"密码",name:"password" },content: {placeholder:"请输入密码",type:"password"}},
    { type:"multiSelect", item: { label: "角色", name: "role_ids" }, content: { placeholder:"请选择角色",options}},
  ]
  const form = loadFormController(items, schema)
  const onFinish = async (values: z.infer<typeof schema>) => {
    const res = await generateUser({ ...values,id: row?.id })
    if (res.code === 200) {
      getData()
      onClose()
    }
  }
  useEffect(() => { 
    if (row) { 
      setTimeout(() => {
        form.reset({
          ...row,
          password:""
        })
       },0)
     }
  },[])
  return (
    <XwyaForm labelWidth={50} form={form} items={items} row={1} onFinish={onFinish}>
    <div className="w-full flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onClose}>
        取消
      </Button>
      <Button type="submit">确认</Button>
    </div>
  </XwyaForm>
  )
}

export default UserForm