import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
type XwyaPopoverProps = {
  children: React.ReactNode
  content: string | React.ReactNode | (() => React.ReactNode | string)
  contentProps?:  React.ComponentPropsWithoutRef<typeof PopoverContent>
  popoverProps?:React.ComponentPropsWithoutRef<typeof Popover>
}
const XwyaPopover = ({ children, content, contentProps, popoverProps }: XwyaPopoverProps) => {
  return <Popover {...popoverProps}>
    <PopoverTrigger>{ children}</PopoverTrigger>
    <PopoverContent  {...contentProps}>{ typeof content === "function" ? content() : content}</PopoverContent>
</Popover>
}
export default XwyaPopover