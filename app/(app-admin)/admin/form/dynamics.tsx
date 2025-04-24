'use client'
import React from 'react'
import XwyaForm, { FormItemsProps } from '@/components/XwyaForm'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/rely/ui_rely'
const schema = z.object({
  input: z.string().optional(),
  select: z.string().optional(),
  textarea: z.string().optional(),
  checkbox: z.array(z.string()).optional(),
  radio: z.string().optional(),
  switch: z.boolean().optional(),
  date: z.date().optional(),
  range: z.object({
    to: z.date().optional(),
    from: z.date().optional()
  }).optional(),
  upload:z.array(z.string()).optional()
})

const defautOptions = [
  { label: "xiaowu", value: "xiaowu" },
  { label: "xiaowu2", value: "xiaowu2" },
]
export default function Dynamics() {
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
  // form.watch((value) => {
  //   console.log(value)
  // })
  const items: FormItemsProps[] = [
    { type: "input", item: { label: "input", name: "input",description:"如果是纵向验证表单必须开启rowFlex" }, content: { placeholder: "请输入123", }, },
    { type: "textarea", item: {label: "textarea", name: "textarea",isShow:"input:123"}, content: { placeholder: "请输入666" } },
    { type: "select", item: { label: "select", name: "select",isShow:"textarea:666" }, content: { placeholder: "请选择xiaowu", options: defautOptions } },
    { type: "checkbox", item: { label: "checkbox", name: "checkbox",isShow:"select:xiaowu" }, content: { placeholder: "请勾选xiaowu2", options: defautOptions } },
    { type: "radio", item: { label: "radio", name: "radio",isShow:"checkbox:xiaowu2" }, content: { placeholder: "请选择xiaowu", options: defautOptions } },
    { type: "switch", item: { label: "switch", name: "switch",isShow:"radio:xiaowu" }, content: { placeholder: "请打开" } },
    { type: "date", item: { label: "date", name: "date",isShow:"switch:true" }, content: { placeholder: "请选择2025-01-01" } },
    { type: "range", item: { label: "range", name: "range",isShow:"date:2025-01-01" }, content: { startPlaceholder: "请选择2025-01-01", endPlaceholder: "请选择2025-01-02" } },
    { type: "upload", item: { label: "upload", name: "upload",isShow:"range:2025-01-01;2025-01-02" }, content: {placeholder:"6666"} }
    
  ]
  const onFinish = (data: any) => {
    console.log(data)
  }
  const onTest = () => { 
    console.log(666);
    form.reset()
    
  }
  return (
    <div className=' mt-4'>
      <div className='px-2 mb-4 border-l-4 border-green-400'>动态表单示例</div>
    <XwyaForm rowFlex layout="vertical" labelAlign="left" items={items} form={form} onFinish={onFinish} >
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
