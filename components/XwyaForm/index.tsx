import { Fragment, Key, ReactNode } from 'react'
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import UploadFile from '@/components/UploadFile'
import { Calendar } from '@/components/ui/calendar'
import {
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
  RadioGroup,
  RadioGroupItem,
  Label,
  Checkbox,
  Textarea,
  Switch,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/rely/ui_rely'
import { cn } from '@/lib/utils'
import { formatDate } from '@/utils/day'
import { zhCN } from 'date-fns/locale'
import { useWatch,type ControllerFieldState } from 'react-hook-form'

type FormItemTypeProps = 'input' | 'select' | 'radio' | 'checkbox' | 'switch' | 'textarea' | 'upload' | 'date' | 'range'
type FormContentProps = {
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  options?: GlobalOptions<string | number |boolean>[]
  multiple?: boolean
  accept?: string
  type?: string
}
type FormItemProps = {
  label: string
  name: string
  itemWidth?: number | string
  description?: string
  isShow?: string
}
export type FormItemsProps = {
  type: FormItemTypeProps
  item: FormItemProps
  content?: FormContentProps
}
type XwyaFormProps = {
  labelWidth?: number
  labelAlign?: 'left' | 'right'
  row?: number
  col?: number
  items: FormItemsProps[]
  form: any
  onFinish?: (values: any) => void
  layout?: 'horizontal' | 'vertical'
  children?: ReactNode
  rowFlex?: boolean
}
const getTypeFormItem = (
  data: FormItemsProps,
  field: any,
  labelWidth: number = 65,
  labelAlign: 'left' | 'right' = 'right',
  layout: 'horizontal' | 'vertical',
  fieldState: ControllerFieldState
) => {
  switch (data.type) {
    case 'input':
      return (
        <>
          <div className={cn(layout === 'horizontal' && 'flex', ' gap-2 items-center')}>
            <FormLabel
              className={cn(layout === 'vertical' ? 'mb-2' : '', 'block')}
              style={{ width: labelWidth, textAlign: labelAlign, flexShrink: 0 }}
            >
              {data.item.label}
            </FormLabel>
            <FormControl>
              <Input className="aria-[invalid=true]:border-destructive  focus-visible:ring-0 focus-visible:ring-none" {...data.content} {...field} />
            </FormControl>
          </div>
          {data.item?.description && <FormDescription style={{marginLeft:layout === 'horizontal'?labelWidth+8:undefined}}>{data.item?.description} </FormDescription>}
          <FormMessage />
        </>
      )
    case 'textarea':
      return (
        <>
          <div className={cn(layout === 'horizontal' && 'flex', ' gap-2 ')}>
            <FormLabel
              className={cn(layout === 'vertical' ? 'mb-2' : '', 'block')}
              style={{ width: labelWidth, textAlign: labelAlign, flexShrink: 0 }}
            >
              {data.item.label}
            </FormLabel>
            <FormControl>
              <Textarea className="aria-[invalid=true]:border-destructive   resize-none !outline-0 focus-visible:ring-0 " {...data.content} {...field} />
            </FormControl>
          </div>
          {data.item?.description && <FormDescription style={{ marginLeft:layout === 'horizontal'?labelWidth+8:undefined}}>{data.item.description} </FormDescription>}
          <FormMessage />
        </>
      )
    case 'select':
      return (
        <>
          <div className={cn(layout === 'horizontal' && 'flex', 'gap-2 items-center')}>
            <FormLabel
              className={cn(layout === 'vertical' ? 'mb-2' : '', 'block')}
              style={{ width: labelWidth, textAlign: labelAlign, flexShrink: 0 }}
            >
              {data.item.label}
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className={`${field.value ? '' : 'text-muted-foreground'} w-full  !outline-0 aria-[invalid=true]:border-destructive  focus:ring-none`}>
                  <SelectValue placeholder={data.content?.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data.content!.options!.map((item) => (
                  <SelectItem key={item.value as Key} value={item.value as string}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {data.item?.description && <FormDescription style={{ marginLeft:layout === 'horizontal'?labelWidth+8:undefined}}>{data.item.description} </FormDescription>}
          <FormMessage />
        </>
      )
    case 'radio':
      return (
        <>
          <div className={cn(layout === 'horizontal' && 'flex', ' gap-2 ')}>
            <FormLabel
              className={cn(layout === 'vertical' ? 'mb-2' : '', 'block')}
              style={{ width: labelWidth, textAlign: labelAlign, flexShrink: 0 }}
            >
              {data.item.label}
            </FormLabel>
            <FormControl>
              <RadioGroup {...data.content} onValueChange={field.onChange} value={field.value}>
                <div className=" flex gap-2 items-center flex-wrap">
                  {data.content!.options!.map((item) => (
                    <div className="flex items-center space-x-2" key={item.value as Key}>
                      <RadioGroupItem value={item.value  as string} id={`${item.value}-radio`} />
                      <Label htmlFor={`${item.value}-radio`}>{item.label}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </FormControl>
          </div>
          {data.item?.description && <FormDescription style={{ marginLeft:layout === 'horizontal'?labelWidth+8:undefined}}>{data.item.description} </FormDescription>}
          <FormMessage />
        </>
      )
    case 'checkbox':
      return (
        <>
          <div className={cn(layout === 'horizontal' && 'flex', 'gap-2 ')}>
            <FormLabel
              className={cn(layout === 'vertical' ? 'mb-2' : '', 'block')}
              style={{ width: labelWidth, textAlign: labelAlign, flexShrink: 0 }}
            >
              {data.item.label}
            </FormLabel>
            <FormControl>
              <div className=" flex gap-2 items-center flex-wrap">
                {data.content!.options!.map((item) => (
                  <div className="flex gap-2" key={item.value  as Key}>
                    <Checkbox
                      id={`${item.value}-checkbox`}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.value
                            ? field.onChange([...field.value, item.value])
                            : field.onChange([item.value])
                          : field.onChange(field.value?.filter((value: string | number) => value !== item.value))
                      }}
                      checked={field.value && field.value?.includes(item.value)}
                    />
                    <Label htmlFor={`${item.value}-checkbox`}>{item.label}</Label>
                  </div>
                ))}
              </div>
            </FormControl>
          </div>
          {data.item?.description && <FormDescription style={{ marginLeft:layout === 'horizontal'?labelWidth+8:undefined}}>{data.item.description} </FormDescription>}
          <FormMessage />
        </>
      )
    case 'switch':
      return (
        <>
          <div className={cn(layout === 'horizontal' && 'flex', 'gap-2 items-center')}>
            <FormLabel
              className={cn(layout === 'vertical' ? 'mb-2' : '', 'block')}
              style={{ width: labelWidth, textAlign: labelAlign, flexShrink: 0 }}
            >
              {data.item.label}
            </FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </div>
          {data.item?.description && <FormDescription style={{ marginLeft:layout === 'horizontal'?labelWidth+8:undefined}}>{data.item.description} </FormDescription>}
          <FormMessage />
        </>
      )
    case 'upload':
      return (
        <>
          <div className={cn(layout === 'horizontal' && 'flex', 'gap-2')}>
            <FormLabel
              className={cn(layout === 'vertical' ? 'mb-2' : '', 'block')}
              style={{ width: labelWidth, textAlign: labelAlign, flexShrink: 0 }}
            >
              {data.item.label}
            </FormLabel>
            <FormControl>
              <UploadFile isError={!!fieldState.error} filelist={field.value} onChange={field.onChange} {...data.content} />
            </FormControl>
          </div>
          {data.item?.description && <FormDescription style={{ marginLeft:layout === 'horizontal'?labelWidth+8:undefined}}>{data.item.description} </FormDescription>}
          <FormMessage />
        </>
      )
    case 'date':
      return (
        <>
          <div className={cn(layout === 'horizontal' && 'flex', 'gap-2 items-center')}>
            <FormLabel
              className={cn(layout === 'vertical' ? 'mb-2' : '', 'block')}
              style={{ width: labelWidth, textAlign: labelAlign, flexShrink: 0 }}
            >
              {data.item.label}
            </FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    aria-invalid={!!fieldState.error}
                    variant={'outline'}
                    className={cn(
                      'flex-1 justify-start text-left font-normal aria-[invalid=true]:border-destructive',
                      layout === 'vertical' && 'w-full',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    <span className="iconify solar--alarm-broken text-base"></span>
                    {field.value ? formatDate(field.value, 'PPP') : <span>{data.content!.placeholder}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar locale={zhCN} mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
            </FormControl>
          </div>
          {data.item?.description && <FormDescription style={{ marginLeft:layout === 'horizontal'?labelWidth+8:undefined}}>{data.item.description} </FormDescription>}
          <FormMessage />
        </>
      )
    case 'range':
      let errStr = ""
      if (fieldState.error) {
        for (let key in fieldState.error) {
          errStr += fieldState.error[key].message + " "
        }
      }
      return (
        <>
          <div className={cn(layout === 'horizontal' && 'flex', ' gap-2 items-center')}>
            <FormLabel
              className={cn(layout === 'vertical' ? 'mb-2' : '', 'block')}
              style={{ width: labelWidth, textAlign: labelAlign, flexShrink: 0 }}
            >
              {data.item.label}
            </FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    aria-invalid={!!fieldState.error}
                    id="date"
                    variant={'outline'}
                    className={cn(
                      'flex-1 justify-start text-left font-normal aria-[invalid=true]:border-destructive',
                      layout === 'vertical' && 'w-full',
                      // !field.value. && 'text-muted-foreground'
                    )}
                  >
                    <span className={ cn("iconify solar--alarm-broken text-base", field.value.from && field.value.to ? '' : 'text-muted-foreground') }></span>
                    <span className={cn(field.value.from ? '' : 'text-muted-foreground')}>
                      {field.value.from ? formatDate(field.value.from, 'PPP') : <span>{data.content!.startPlaceholder}</span>}
                    </span>
                    <span className={cn('text-muted-foreground')}>-</span>
                    <span className={cn(field.value.to ? '' : 'text-muted-foreground')}>
                      {field.value.to ? formatDate(field.value.to, 'PPP') : <span>{data.content!.endPlaceholder}</span>}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    locale={zhCN}
                    initialFocus
                    mode="range"
                    defaultMonth={field.value.from}
                    selected={field.value}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
          </div>
          {data.item?.description && <FormDescription style={{ marginLeft: layout === 'horizontal' ? labelWidth + 8:undefined }}>{data.item.description} </FormDescription>}
          {errStr && <div className='text-[0.8rem] font-medium text-destructive'>{ errStr}</div> }
          {/* <FormMessage /> */}
        </>
      )
  }
}

const XwyaForm = (props: XwyaFormProps) => {
  const { items = [], row = 1, col = 1, rowFlex = false, layout = 'horizontal', labelAlign, labelWidth, onFinish, children, form } = props
  let colNum = col
  let rowNum = row
  let colCount = Math.ceil(items.length / col)
  if (colNum === 1 && rowNum === 1) {
    if (rowFlex) {
      rowNum = colCount
    } else {
      colNum = colCount
    }
  } else {
    if (col * row < items.length) {
      colNum = colCount
    }
  }
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault() // 阻止默认表单提交（页面刷新）
    e.stopPropagation() // 阻止事件冒泡，防止外部表单提交
    form.handleSubmit(onFinish)() // 手动提交内部表单
  }
  const getItem = (index: number) => {
    return items.slice(index * rowNum, (index + 1) * rowNum)
  }
  const handleIsShowItem = (isShow: string | undefined): boolean => {
    if (isShow === undefined) {
      return true
    }
    const [key, value] = isShow.split(':')
    const pervVal = useWatch({ control: form.control, name: key }); 
    if (typeof pervVal === 'string') {
      return pervVal === value
    }
    if (typeof pervVal === 'boolean') {
      return JSON.stringify(pervVal) === value
    }
    if (Array.isArray(pervVal)) {
      return pervVal.join(',') === value
    }
    if (pervVal instanceof Date) {
      return formatDate(pervVal, 'yyyy-MM-dd') === value
    }
    if (typeof pervVal === 'object' && Object.keys(pervVal).length === 2 && pervVal.from && pervVal.to) {
      const dataStr = `${formatDate(pervVal.from, 'yyyy-MM-dd')};${formatDate(pervVal.to, 'yyyy-MM-dd')}`
      return dataStr === value
    }
    return false
  }

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} autoComplete="off">
        <div className="flex flex-col gap-4">
          {Array.from({ length: colNum }).map((_, index) => (
            <div key={index}>
              <div className="flex  gap-4 flex-wrap items-center w-full">
                {getItem(index).map((item, i: number) => (
                  <Fragment key={`${index}-${i}`}>
                    <FormField
                      key={item.item.name}
                      control={form.control}
                      name={item.item.name}
                      render={({ field,fieldState }) => {
                        if (!handleIsShowItem(item.item?.isShow)) {
                          return <></>
                        }
                       return  <FormItem
                          style={{
                            width: rowFlex
                              ? '100%'
                              : item.item?.itemWidth
                                ? item.item.itemWidth
                                : `calc((100% - ${(rowNum - 1) * 16}px) / ${rowNum})`,
                          }}
                          className="max-md:!w-full"
                        >
                          {getTypeFormItem(item, field, labelWidth, labelAlign, layout,fieldState)}
                        </FormItem>
                      }}
                    />
                  </Fragment>
                ))}
                {index + 1 === colNum && (
                  <div
                    className={cn(
                      rowNum === 1 || rowFlex ? 'w-full' : 'w-auto',
                      'flex flex-wrap gap-2 items-center max-md:justify-end  max-md:!w-full'
                    )}
                  >
                    {children}{' '}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </form>
    </Form>
  )
}

export default XwyaForm
