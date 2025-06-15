"use client"
import { createRoot } from 'react-dom/client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,Button } from '@/rely/ui_rely'
import React, { useState } from 'react'
import { toast} from "react-hot-toast"
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
type ModalProps = {
  title?: React.ReactNode | (()=> React.ReactNode|string) | string
  description?: React.ReactNode | (()=> React.ReactNode|string) | string
  footer?: false| React.ReactNode | (()=> React.ReactNode|string) | string
  children?: React.ReactNode | (() => React.ReactNode | string) | string
  contentProps?: React.ComponentPropsWithoutRef<typeof DialogContent>
  modalProps?: React.ComponentPropsWithoutRef<typeof Dialog>
  confirmText?: string
  cancelText?: string
  confirmClass?:string
  cancelClass?:string
  confirm?:  () => void | boolean | Promise<boolean>
  cancel?: () => void | boolean | Promise<boolean>
  repeatText?: string
  isConfirmBnt?: boolean
  isCancelBnt?: boolean
}
const Modal = ({ close, children, title, description, confirmClass,cancelClass,footer,contentProps,modalProps,confirmText, cancelText,confirm,cancel,repeatText,isCancelBnt=true,isConfirmBnt=true }: ModalProps & { close: () => void }) => {
  const [open, setOpen] = useState(true)
  const [disabled,setDisabled] = useState(false)
  const onChange = (isOpen:boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      Promise.resolve(close())
    }
  }
  const onConfirm = async () => {
    if(disabled){
      toast.error(repeatText ||  "当前正在操作请稍等...")
      return 
    }
    setDisabled(true)
    if (confirm) {
      const flag = await confirm()
      if (flag===undefined || flag) {
        close()
      }
    } else {
      close()
    }
    setDisabled(false)
  }
  const onCancel = async () => {
    if (disabled) { 
      toast.error("当前正在操作请稍等...")
      return 
    }
    if (cancel) {
      const flag = await cancel()
      if (flag===undefined || flag) {
        close()
      }
    } else {
      close()
    }
  }
  return (
    <Dialog  {...modalProps} open={open} onOpenChange={onChange}>
      <DialogContent {...contentProps} className={cn("p-4  rounded-lg", contentProps?.className) }>
        <DialogHeader className=' text-right'>
          <DialogTitle>{typeof title === 'function' ? title() : title}</DialogTitle>
          <DialogDescription>{typeof description === 'function' ? description() : description}</DialogDescription>
        </DialogHeader>
        {typeof children === 'function' ? children() : children}
        {footer !== false && <DialogFooter>
            {footer === undefined ? (<div className='flex justify-end items-center gap-2'>
              { isCancelBnt && <Button className={cancelClass} variant="outline" onClick={onCancel}>{ cancelText || '取消' }</Button>} 
              { isConfirmBnt && <Button className={confirmClass} disabled={disabled}  onClick={onConfirm}>
                {disabled && <Loader2 className="animate-spin"/>}
                { confirmText || '确认'}
                </Button>}
            </div>):   typeof footer === 'function' ? footer() : footer} 
        </DialogFooter>}
      
      </DialogContent>
    </Dialog>
  )
}

export default function createModal(props: ModalProps) {
  const container = document.querySelector('.global_modal_container')
  if (!container) return
  const div = document.createElement('div')
  container.appendChild(div)
  const root = createRoot(div)
  const unmount = () => {
    root.unmount()
    div.remove()
  }
  root.render(<Modal close={unmount} {...props} />)
  return unmount
}
