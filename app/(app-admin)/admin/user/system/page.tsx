'use client'
import React, { useEffect, useMemo, useState } from 'react'
import XwyaForm, { FormItemsProps } from '@/components/XwyaForm'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/rely/ui_rely'
import useUserStore from '@/store/user'
import { getRoleOption } from "@/api/role"
import { OptionsKeyEnums } from '@/enums/cacheEnums'
class UserQueryForm {
  username = ""
  account = "";
  email = "";
  phone = "";
  roles = ""
  status = ""
}
const schema = z.object({
  username: z.string().optional(),
  account: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  roles: z.string().optional(),
  status: z.string().optional(),
})


const SystemUser = () => {
  const defaultOptions = useUserStore((state) => state.defaultOptions)
  const [rolesOptions, setRolesOptions] = useState<GlobalOptions<number>[]>([])
  // { type: 'input', item: { label: 'input', name: 'input',itemWidth:260  }, content: { placeholder: '6666' } },
  const items = useMemo<FormItemsProps[]>(() => [
    { type: 'input',  item: { label: '用户名', name: 'username',itemWidth:"260px", }, content: { placeholder: '请输入用户名' } },
    { type: 'input',  item: { label: '账号', name: 'account',itemWidth:"260px" }, content: { placeholder: '请输入账号' } },
    { type: 'input',  item: { label: "邮箱", name: "email",itemWidth:"260px" }, content: { placeholder: "请输入邮箱" } },
    { type: 'input', item: { label: "手机号", name: "phone",itemWidth:"260px" }, content: { placeholder: "请输入手机号" } },
    { type: "select", item: { label: "角色", name: "roles",itemWidth:"260px" }, content: { placeholder: "请选择角色", options: rolesOptions } },
    { type: "select", item: { label: "状态", name: "status",itemWidth:"260px" }, content: { placeholder: "请选择状态", options: defaultOptions[OptionsKeyEnums.STATUS] || [] } },
  ],[defaultOptions,rolesOptions])
  
   const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues:{
        ...new UserQueryForm()
      },
   })
  const getRolesOptions = async () => { 
    const res = await getRoleOption()
    if (res.code === 200) { 
      setRolesOptions(res.data!)
    }
  }
  const onFinish = (value:z.infer<typeof schema>) => {
    console.log(value)
  }
  const onReset = () => { 
    console.log(666);
    form.reset()
  }
  useEffect(() => { 
    getRolesOptions()
  },[])

  return (
    <div>
      <XwyaForm labelWidth={50} labelAlign='right' items={items} form={form} onFinish={onFinish} row={4} col={2}>
        {
          <div className=" flex gap-2">
            <Button type="submit">搜索</Button>
            <Button variant="outline" type="button" onClick={onReset}>
              重置
            </Button>
          </div>
        }
      </XwyaForm>
    </div>
  )
}

export default SystemUser