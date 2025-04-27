"use client";
import React from 'react'
import XwyaForm, { FormItemsProps } from '@/components/XwyaForm'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/rely/ui_rely'
import cache from '@/lib/cache';
import { useRouter } from 'next/navigation';
import { IsLogin,TokenEnums } from '@/enums/cacheEnums';
import { login } from '@/api/system';
import { useSearchParams } from 'next/navigation';
const formSchema = z.object({
  account: z.string().nonempty({message:"账号不能为空"}),
  password: z.string().min(6, {
    message: '密码不能小于6位',
  }),
})
const items:FormItemsProps[] = [
  { type: 'input', item: { label: '账号', name: 'account' }, content: { placeholder: '请输入账号' } },
  { type: 'input', item: { label: '密码', name: 'password' }, content: { placeholder: '请输入密码', type: 'password' } },
]

const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") 
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        account: '',
        password: '',
      },
  })
  const onFinish = async (values: z.infer<typeof formSchema>) => {
      cache.setCookie(IsLogin, true)
      router.push(redirect?decodeURIComponent(redirect):"/admin")
  }
  return (
    <XwyaForm  items={items} form={form} labelAlign="left" layout="vertical" onFinish={onFinish}>
    <div className="mt-4 w-full">
      <Button className=" w-full text-base" type="submit">登录</Button>
    </div>
      </XwyaForm>
  )
}

export default LoginForm