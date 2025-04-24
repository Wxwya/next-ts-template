import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut
} from '@/components/ui/dropdown-menu'
export type DropdownMenuOptions = {
  icon?: string,
  value: string | (()=>React.ReactNode) | React.ReactNode,
  className?: string,
  key: string | number,
  line?: boolean,
  afterSlot?:string | (()=>React.ReactNode) | React.ReactNode
}
type XwyaDropdownMenuProps = {
  options: DropdownMenuOptions[]
  children?: React.ReactNode,
  contentConfig?: React.ComponentProps<typeof DropdownMenuContent>
  onChange?: (row:DropdownMenuOptions) => void
} & React.ComponentProps<typeof DropdownMenu> 

export const XwyaDropdownMenu = (props: XwyaDropdownMenuProps) => {
  const { options, children, contentConfig,onChange, ...rest } = props
  return (
    <DropdownMenu {...rest}>
      { !Object.keys(rest).length && <DropdownMenuTrigger>
          { children }
    </DropdownMenuTrigger> } 
      <DropdownMenuContent side='bottom' {...contentConfig}>
        {options.map((item, index: number) => (
          <React.Fragment key = { item.key || index }>
          {item?.line && <DropdownMenuSeparator />}
          <DropdownMenuItem className={item?.className} onClick={()=>onChange&&onChange(item)} >
            {item?.icon && <span className={`iconify ${item?.icon}`}></span>}
              <span>{typeof item.value === 'function' ? item.value() : item.value}</span>
              {item?.afterSlot && <DropdownMenuShortcut>{typeof item.afterSlot === 'function' ? item?.afterSlot() : item?.afterSlot}</DropdownMenuShortcut>}
            </DropdownMenuItem>
            </React.Fragment>
        ))}
    </DropdownMenuContent>
  </DropdownMenu>
  )
}

 