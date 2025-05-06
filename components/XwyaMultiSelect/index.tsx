import React, { Key } from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check,ChevronDown } from "lucide-react"



interface MultiSelectProps {
  options?: GlobalOptions<string|number|boolean>[]
  value: any[]
  onChange: (value: any[]) => void
  placeholder?: string
  className?: string
  isError?: boolean
  disabled?: boolean
}

 const XwyaMultiSelect: React.FC<MultiSelectProps> = ({
  options=[],
  value=[],
  onChange,
  placeholder = "请选择",
   className,
   isError,
   disabled
}) => {
   const toggleOption = (val: any) => {
    console.log(value,val);
    
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val))
    } else {
      onChange([...value, val])
    }
  }
  return (
    <Popover >
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          className={cn(" justify-between w-full",className, isError && "border-red-500")}
        >
          <span className={cn(!value.length&&"text-muted-foreground")}>
          {value.length
            ? options
                .filter((opt) => value.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ")
            : placeholder}
          </span>
          
          <ChevronDown className="h-4 w-4 opacity-50"  />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-1 flex flex-col gap-1")} style={{ width: 'var(--radix-popover-trigger-width)' }} align="start" >
        {options.map((opt) => {
          const isSelected = value.includes(opt.value)
          return (
            <div
              key={opt.value as Key}
              className={cn(
                "flex items-center justify-between p-2  rounded cursor-pointer hover:bg-muted",
                isSelected && "bg-muted"
              )}
              onClick={() => toggleOption(opt.value)}
            >
              <Label>{opt.label}</Label>
              {isSelected && <Check className="h-4 w-4 text-primary" />}
            </div>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

export default XwyaMultiSelect