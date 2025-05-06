'use client'
import React from 'react'
import XwyaForm, { FormItemsProps } from '@/components/XwyaForm'
import { z} from 'zod'
import { Button } from '@/rely/ui_rely'
import { loadFormController } from '@/utils/handle'
const schema = z.object({
  input: z.string().optional(),
  select: z.string().optional(),
  range: z.object({
    to: z.date().optional(),
    from: z.date().optional()
  }).optional(),
})

const defautOptions = [
  { label: 'xiaowu', value: 'xiaowu' },
  { label: 'xiaowu2', value: 'xiaowu2' },
]
export default function Verify() {

  const items: FormItemsProps[] = [
    { type: 'input', item: { label: 'input', name: 'input',itemWidth:260  }, content: { placeholder: '6666' } },
    // { type: "textarea", item: {label: "textarea", name: "textarea" }, content: { placeholder: "6666" } },
    { type: 'select', item: { label: 'select', name: 'select',itemWidth:260 }, content: { placeholder: '6666', options: defautOptions } },
    // { type: "checkbox", item: { label: "checkbox", name: "checkbox" }, content: { placeholder: "6666", options: defautOptions } },
    // { type: "radio", item: { label: "radio", name: "radio" }, content: { placeholder: "6666", options: defautOptions } },
    // { type: "switch", item: { label: "switch", name: "switch" }, content: { placeholder: "6666" } },
    // { type: "date", item: { label: "date", name: "date" }, content: { placeholder: "6666" } },
    { type: 'range', item: { label: 'range', name: 'range',itemWidth:320 }, content: { startPlaceholder: '开始时间', endPlaceholder: '结束时间' } },
  ]
      const form = loadFormController(items,schema)
  const onFinish = (data: any) => {
    console.log(data)
  }
  const onTest = () => {
    console.log(666)
    form.reset()
  }
  return (
    <div className=" mt-4">
      <div className="px-2 mb-4 border-l-4 border-green-400">查询表单示例</div>
      <XwyaForm labelWidth={40} labelAlign='right' items={items} form={form} onFinish={onFinish} row={2} col={2}>
        {
          <div className=" flex gap-2">
            <Button type="submit">提交</Button>
            <Button variant="outline" type="button" onClick={onTest}>
              重置
            </Button>
          </div>
        }
      </XwyaForm>
    </div>
  )
}
