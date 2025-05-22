import React, { useEffect, useRef, useState } from 'react'
import XwyaEmoji from '@/components/XwyaEmoji'
import XwyaTooltip from '@/components/XwyaTooltip'
import XwyaButton from '@/components/XwyaButton'
import { Textarea } from '@/components/ui/textarea'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

type XwyaChartInputProps = {
  value: string
  onChange: (value: string) => void
}
const XwyaChartInput = (props: XwyaChartInputProps) => {
  const { value, onChange } = props
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const isMobile = useIsMobile()
  const resizeHeight = () => { 
    if (textareaRef.current) {
      textareaRef.current.style.height = '32px'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }
  const onChangeEmoji = (emoji:string) => { 
    onChange && onChange(value+emoji.native)
  }
  useEffect(() => { 
    resizeHeight()
  },[value])
  return (
    <div className={ cn('px-3 py-2 bg-sidebar border-t border-solid flex gap-2',textareaRef.current && textareaRef.current.scrollHeight>32?'items-start':'items-center')} >
      <div className='  flex  gap-1 items-center'>
        <XwyaTooltip text='图片'  open>
          <XwyaButton variant='ghost' className=' text-lg p-1 h-auto' icon='solar--gallery-bold' />
        </XwyaTooltip>
        <XwyaEmoji onChange={onChangeEmoji}  /> 
      </div>
      <div className='flex-1'> 
        <Textarea value={value} onChange={(e)=> onChange(e.target.value)} ref={textareaRef} className='resize-none py-1 max-h-[80px] min-h-8 h-8 focus-visible:ring-0'  />
      </div>
      <div className=' flex gap-1 items-center'>
      {/* <XwyaTooltip text='语音'  open>
          <XwyaButton variant='ghost' className=' text-lg p-1 h-auto' icon='solar--microphone-2-bold' />
        </XwyaTooltip> */}
        <XwyaTooltip text='发送'  open>
          <XwyaButton variant={isMobile?'ghost':'default' } className=' text-lg p-1 h-auto' icon='solar--plain-3-bold' >
            { !isMobile &&  <span className=' text-sm'>发送</span>}
          </XwyaButton>
        </XwyaTooltip>
      </div>
    </div>
  )
}

export default XwyaChartInput