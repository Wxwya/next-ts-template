'use client'
import React, { useEffect } from 'react'
import z from "zod"
import useUserStore from "@/store/user"
import XwyaForm, { type FormItemsProps} from '@/components/XwyaForm'
import { loadFormController } from '@/utils/handle'
import { OptionsKeyEnums } from '@/enums/cacheEnums'
import { Button } from '@/rely/ui_rely'
import { generateDictType } from '@/api/dict'
const schema = z.object({
  dict_name: z.string().nonempty({ message: '字典名称不能为空' }),
  type_name: z.string().nonempty({ message: '字典类型不能为空' }),
  is_default: z.string().optional(),
  comment: z.string().optional()
})

const DictTypeForm = ({ row, onClose,getData }: {row?:Dict.DictTypeInfo,onClose:()=>void,getData:Function}) => {
  const userInfo = useUserStore((state) => state.userInfo)
  const defaultOptions = useUserStore((state) => state.defaultOptions)
  const items:FormItemsProps[] = [
    { type: 'input', item: { label: '字典名称', name: 'dict_name', }, content: { placeholder: '请输入字典名称' } },
    { type: 'input', item: { label: '字典类型', name: 'type_name', }, content: { placeholder: '请输入字典类型' } },
    ...(userInfo?.account === "admin" ? [{
      type: 'select',
      item: { label: "系统配置", name: "is_default" },
      content: { placeholder: "请选择是否系统配置", options: defaultOptions[OptionsKeyEnums.YESNO] }
    }] as FormItemsProps[] : []),
    { type: 'input', item: { label: '备注:', name: 'comment' }, content: {placeholder: '请输入备注'}},
  ]
  const form = loadFormController(items, schema)
  const onFinish = async (values: z.infer<typeof schema>) => { 
    const res = await generateDictType({...values,id:row?.id})
    if (res.code === 200) { 
      getData()
      onClose()
    }
  }
  useEffect(() => { 
    if (row) { 
      Promise.resolve().then(() =>{ form.reset(row)}) 
    }
  },[])
  return (
    <XwyaForm   form={form} items={items} row={1} onFinish={onFinish}>
      <div className='w-full flex justify-end gap-2'>
        <Button type='button' variant="outline" onClick={onClose}>取消</Button>
        <Button type='submit'>确认</Button>
      </div>
    </XwyaForm>
  )
}

export default DictTypeForm