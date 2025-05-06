import React, { useEffect } from 'react'
import z from 'zod'
import XwyaForm, { type FormItemsProps } from '@/components/XwyaForm'
import { loadFormController } from '@/utils/handle'
import useUserStore from '@/store/user'
import { Button } from '@/rely/ui_rely'
import { generateDict } from '@/api/dict'
type DictFormProps = {
  row?: Dict.DictInfo
  onClose: () => void
  getData: Function
  total: number
  dictTypeId: number
}
const schema = z.object({
  dict_label: z.string().nonempty({ message: '字典键不能为空' }),
  dict_value: z.string().nonempty({ message: '字典值不能为空' }),
  order_num: z.string().nonempty({ message: '排序不能为空' }),
})
const items: FormItemsProps[] = [
  { type: 'input', item: { label: '字典键', name: 'dict_label' }, content: { placeholder: '请输入字典键' } },
  { type: 'input', item: { label: '字典值', name: 'dict_value' }, content: { placeholder: '请输入字典值' } },
  { type: 'input', item: { label: '排序', name: 'order_num' }, content: { placeholder: '请输入排序' } },
]
const DictForm = (props: DictFormProps) => {
  const { username } = useUserStore((state) => state.userInfo!)
  const { row, onClose, getData, total, dictTypeId } = props
  const form = loadFormController(items, schema)
  const onFinish = async (values: Dict.DictInfo) => {
    const res = await generateDict({ ...values, order_num: Number(values.order_num), dict_type_id: Number(dictTypeId), username })
    if (res.code === 200) {
      getData()
      onClose()
    }
  }
  useEffect(() => {
    if (row) {
      form.reset({
        ...row,
        order_num: row.order_num!.toString(),
      })
    } else {
      form.reset({
        order_num: (total + 1).toString(),
      })
    }
  }, [])
  return (
    <XwyaForm form={form} items={items} row={1} onFinish={onFinish}>
      <div className="w-full flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          取消
        </Button>
        <Button type="submit">确认</Button>
      </div>
    </XwyaForm>
  )
}

export default DictForm
