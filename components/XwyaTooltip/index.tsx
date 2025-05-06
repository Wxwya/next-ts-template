import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
type XwyaTooltipProps = {
  children: React.ReactNode | string
  text?: string | null | undefined
  open?: boolean | undefined
}&React.ComponentPropsWithoutRef<typeof TooltipContent>
const XwyaTooltip = (props: XwyaTooltipProps) => {
  const { children, text,open,...rest } = props
  const config = open ? {} : {open:false}
  return (
    <TooltipProvider >
      <Tooltip {...config} >
        <TooltipTrigger asChild ><div >{children}</div></TooltipTrigger>
        <TooltipContent  className="max-w-[700px]" data-auth="2" {...rest}>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default XwyaTooltip
