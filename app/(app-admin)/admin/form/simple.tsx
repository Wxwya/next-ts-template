'use client'
import React from 'react'
import XwyaForm, { FormItemsProps } from '@/components/XwyaForm'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/rely/ui_rely'
const schema = z.object({
  input: z.string().nonempty({message:"不能为空"}),
  select: z.string().nonempty({message:"不能为空"}),
  textarea: z.string().nonempty({message:"不能为空"}),
  checkbox: z.array(z.string()).optional(),
  radio: z.string().optional(),
  switch: z.boolean().optional(),
  date: z.date({
    required_error: "不能为空",
    invalid_type_error: "请选择日期"
  }),
  range: z.object({
    to: z.date({
      required_error: "开始不能为空",
    invalid_type_error: "请选择日期"
    }),
    from: z.date({
      required_error: "接收不能为空",
      invalid_type_error: "请选择日期"
    })
  }),
  upload:z.array(z.string()).nonempty({message:"不能为空"})
})

const defautOptions = [
  { label: "xiaowu", value: "xiaowu" },
  { label: "xiaowu2", value: "xiaowu2" },
]
export default function Simple() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues:{
      input: '',
      select: '',
      textarea: '',
      checkbox: [],
      radio:void 0,
      switch: false,
      date:void 0,
      range: {
        to: void 0,
        from: void 0
      },
      upload:[]
    },
  })

  
  const items: FormItemsProps[] = [
    { type: "input", item: { label: "input", name: "input" }, content: { placeholder: "6666" } },
    { type: "textarea", item: {label: "textarea", name: "textarea" }, content: { placeholder: "6666" } },
    { type: "select", item: { label: "select", name: "select" }, content: { placeholder: "6666", options: defautOptions } },
    { type: "checkbox", item: { label: "checkbox", name: "checkbox" }, content: { placeholder: "6666", options: defautOptions } },
    { type: "radio", item: { label: "radio", name: "radio" }, content: { placeholder: "6666", options: defautOptions } },
    { type: "switch", item: { label: "switch", name: "switch" }, content: { placeholder: "6666" } },
    { type: "date", item: { label: "date", name: "date" }, content: { placeholder: "6666" } },
    { type: "range", item: { label: "range", name: "range" }, content: { startPlaceholder: "开始时间", endPlaceholder: "结束时间" } },
    { type: "upload", item: { label: "upload", name: "upload" }, content: {placeholder:"6666"} }
    
  ]
  const onFinish = (data: any) => {
    console.log(data)
  }
  const onTest = () => { 
    console.log(666);
    form.reset()
    
  }
  return (
    <div>
      <div className='px-2 mb-4 border-l-4 border-green-400'>简单示例</div>
    <XwyaForm layout="vertical" labelAlign="left" items={items} form={form} onFinish={onFinish} >
    { 
      <div className='flex gap-2'>
        <Button type="submit" >提交</Button>
        <Button variant="outline" type='button' onClick={onTest}>重置</Button>
      </div>
    }
    </XwyaForm>
    </div>

  )
}
