import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import { Select, SelectContent,  SelectItem, SelectTrigger, SelectValue,Input,Button} from "@/rely/ui_rely"
type Position = 'left' | 'center' | 'right'
type PaginationpRrops = {
  currentPage: number
  pageSize: number
  total: number
  onChange?: (page: number, pageSize: number) => void
  maxShowSize?: number
  pageSizeOptions?: number[]
  showSizePicker?: boolean
  showQuickJumper?: boolean
  position?: Position
  prefix?: string | React.ReactNode | (() => React.ReactNode | string)
  suffix?: string | React.ReactNode | (() => React.ReactNode |string)
  className?:string
}
import {toast} from "react-hot-toast"
function handlePaginationPosition(p: Position) {
  switch (p) {
    case 'left':
      return 'justify-start'
    case 'center':
      return 'justify-center'
    case 'right':
      return 'justify-end'
    default:
      return 'justify-center'
  }
}
function handlePageSize(
  max: number,
  currentPage: number,
  pageSize: number,
  total: number
): (number | string)[] {
  if (max < 5) {
    console.warn('max must be >= 5, auto-adjusted');
    max = 5;
  }
  const totalPages = Math.ceil(total / pageSize);
  const pages: (number | string)[] = [];

  if (totalPages <= max) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const showLeft = 1;
  const showRight = totalPages;

  const surrounding = Math.floor((max - 3) / 2);
  let start = Math.max(2, currentPage - surrounding);
  let end = Math.min(totalPages - 1, currentPage + surrounding);

  // 调整当页码靠近边界时的分布
  if (currentPage - 1 <= surrounding) {
    start = 2;
    end = max - 2;
  } else if (totalPages - currentPage <= surrounding) {
    start = totalPages - (max - 3);
    end = totalPages - 1;
  }

  pages.push(showLeft);

  if (start > 2) {
    pages.push('...');
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push('...');
  }

  pages.push(showRight);

  return pages;
}
export default function XwyaPagination(props: PaginationpRrops) {
  const {
    currentPage,
    pageSize = 10,
    total,
    onChange = () => { },
    maxShowSize = 5,
    pageSizeOptions = [10, 15, 20],
    showSizePicker = false,
    showQuickJumper = false,
    position = 'right',
    prefix,
    suffix,
    className
  } = props
  const pagenum  =handlePageSize(maxShowSize,currentPage,pageSize, total)
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let number = Number( e.currentTarget.value)
      if (isNaN(number) || number < 1) {
        toast.error('请输入有效数字')
        return
      }
      if (number > Math.ceil(total / pageSize)) { 
        toast.error('超过最大页码')
        return
      }
      onChange(currentPage, number)
    }
  }
  const onNextPrev = (key: "prev" | "next")=>{ 
    if (key == "next") { 
      const nextNum = currentPage + 1
      if (nextNum > Math.ceil(total / pageSize)) {
        toast.error('已经是最后一页~~')
         return
      }
      onChange(nextNum, pageSize)
    }
    if (key == "prev") {
      const prevNum = currentPage - 1
      if (prevNum < 1) {
        toast.error('已经是第一页了~~')
        return
      }
      onChange(prevNum, pageSize)
    }
  }
  return (
    <Pagination className={`${handlePaginationPosition(position)} ${className} gap-2`}>
      {prefix && 
        <div className='flex items-center'>{typeof prefix ==='function'?prefix():prefix}</div>
      }
      <PaginationContent>
        <PaginationItem>
          <Button  variant="ghost" className='curson-pointer' onClick={()=>onNextPrev('prev')}>
            <span className='iconify solar--alt-arrow-left-line-duotone'></span>
          </Button>
           {/* <span>上一页</span> */}
        </PaginationItem>
        {pagenum.map((item,index:number) => (
          <PaginationItem className=' rounded-lg' style={{ background: currentPage === item ? 'black' : '', color: currentPage === item ? 'white' : '' }} key={`${item}-${index}`}>
            {item == '...' ? <PaginationEllipsis /> : <PaginationLink  onClick={() => onChange((item as number), pageSize)}>{item}</PaginationLink>}
          </PaginationItem>
        ))}
        <PaginationItem>
        <Button  variant="ghost" className='curson-pointer' onClick={()=>onNextPrev('next')}>
            <span className='iconify solar--alt-arrow-right-line-duotone'></span>
          </Button>
        </PaginationItem>
      </PaginationContent>
     
        {showSizePicker &&  <div> <Select value={String(pageSize)} onValueChange={(value)=>onChange(currentPage,Number(value))}>
          <SelectTrigger className="w-[90px]" >
            <SelectValue placeholder={`${pageSize}/页`} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((item) => (
              <SelectItem key={item} value={String(item)}>
                {item}/页
              </SelectItem>
            ))}
          </SelectContent>
      </Select> </div>}
      {showQuickJumper && <div className=' flex items-center gap-2'>
        <div>跳转到</div>
        <Input className='w-[60px]' defaultValue={currentPage} onKeyDown={onKeyDown}  />
        <div>页</div>
      </div>}
      { suffix && <div className='flex items-center'>{typeof suffix ==='function'?suffix():suffix}</div>}
       
      
    </Pagination>
  )
}
