import React from 'react'
import XwyaTooltip from '@/components/XwyaTooltip'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
type XwyaButtonProps = {
  children?: React.ReactNode
  tooltipText?: string
  icon?: string
  tooltipConfig?: React.ComponentPropsWithoutRef<typeof XwyaTooltip>
}&React.ComponentPropsWithoutRef<typeof Button>
const XwyaButton = (props: XwyaButtonProps) => {
  const { tooltipText, icon, children,  ...rest } = props
  return (
    <XwyaTooltip  open={!!tooltipText} text={tooltipText}>
      <Button  {...rest}>
        {icon && <span className={cn("iconify", icon)}></span>}
        {children}
      </Button>
    </XwyaTooltip>
  )
}

export default XwyaButton