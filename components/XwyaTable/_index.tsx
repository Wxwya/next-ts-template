// 'use client'
// import  React from 'react'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import toast from 'react-hot-toast'
// import { PageType, useState } from "@/rely/admin_global"
// import {ColumnDef,ColumnFiltersState,SortingState,VisibilityState,flexRender,getCoreRowModel,getFilteredRowModel,getPaginationRowModel,getSortedRowModel,useReactTable,} from '@tanstack/react-table'
// import { Input,Checkbox,Button,DropdownMenu,DropdownMenuCheckboxItem,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger} from "@/rely/admin_ui"

// /***
//  * id：唯一标识符
//  *
//  * header: 渲染表頭内容
//  * table.getIsAllPageRowsSelected() : 如果所有的行都被選中，則返回 true。
//  * table.getIsSomePageRowsSelected() : 如果部分行被選中，則返回 true。
//  * table.toggleAllPageRowsSelected() : 選中或取消選中所有的行。
//  *
//  * cell: 渲染每个单元格的内容
//  * row.getIsSelected() : 如果行被選中，則返回 true。
//  * row.toggleSelected() : 選中或取消選中行。
//  * enableSorting: false : 禁用排序功能。
//  * enableHiding: false : 禁用隐藏列功能。
//  *
//  * accessorKey: 指定列的访问器键。
//  * header: 表頭文本
//  *  minSize: 最小寬度,
//  * maxSize: 最大寬度,
//  * row.getValue(key) : 获取行中指定键的值。
//  *  <ArrowUpDown /> 排序組件
//  */
// export type CustomColumnDef<T> = ColumnDef<T> & {
//   className?: string
// }
// type XwyaTableProps<T> = {
//   data: any[]
//   columns: CustomColumnDef<T>[]
//   total?: number
//   onChange?: (page: PageType) => void
//   page: PageType
//   loading?: boolean
//   className?: string
// }

// const XwyaTable = <T,>({ data = [], columns = [], total = 1, onChange, page, loading, className }: XwyaTableProps<T>) => {
//   const [sorting, setSorting] = useState<SortingState>([])
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
//   const [rowSelection, setRowSelection] = useState({})
//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting, // 排序發生變化的回調
//     onColumnFiltersChange: setColumnFilters, // 当列过滤器发生变化时的回调函数
//     getCoreRowModel: getCoreRowModel(), // 获取表格的基本行数据
//     // getPaginationRowModel: getPaginationRowModel(), //获取分页的行数据模型
//     getSortedRowModel: getSortedRowModel(), // 获取排序的行数据模型
//     getFilteredRowModel: getFilteredRowModel(), // 获取过滤后的行数据模型
//     onColumnVisibilityChange: setColumnVisibility, // 当列的可见性发生变化时的回调函数
//     onRowSelectionChange: setRowSelection, // 当行的选择状态发生变化时的回调函数
//     // onPaginationChange:onChangePage,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//       pagination: {
//         pageIndex: page!.pageNo - 1,
//         pageSize: page!.pageSize,
//       },
//     },
//     pageCount: total,
//   })
//   const prev = async () => {
//     if (onChange) {
//       const pageNo = page!.pageNo - 1
//       if (pageNo < 1) return
//       onChange && onChange({ ...page, pageNo: pageNo })
//       table.previousPage()
//     }
//   }
//   const next = async () => {
//     if (onChange) {
//       const pageNo = page.pageNo + 1
//       if (pageNo > total) return
//       onChange && onChange({ ...page, pageNo: pageNo })
//     }
//   }
//   const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter') {
//       console.log('User pressed Enter:')
//       // 检查输入值是否有效
//       const pageNumber = Number((event.target as HTMLInputElement).value)
//       if (pageNumber <= 0 || pageNumber > total) {
//         toast.error('請輸入正確的頁碼')
//         return
//       }
//       onChange && onChange({ ...page, pageNo: pageNumber })
//       table.setPageIndex(pageNumber)
//     }
//   }
//   return (
//     <div className={className}>
//       <div className="rounded-md border flex-1">
//         <Table className=" h-full table-fixed  w-full">
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id} className={(header.column.columnDef as CustomColumnDef<T>).className}>
//                       {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                     </TableHead>
//                   )
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows.map((row) => (
//               <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id} className={(cell.column.columnDef as CustomColumnDef<T>).className}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}

//             {!loading && !table.getRowModel().rows.length && (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   暂无数据.
//                 </TableCell>
//               </TableRow>
//             )}

//             {loading && (
//               <TableRow>
//                 <TableCell className=" absolute inset-0 flex justify-center bg-[rgba(255,255,255,0.6)] dark:bg-[rgba(0,0,0,.3)] items-center  z-20">
//                   正在加载...
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className=" shrink-0 flex items-center  justify-end space-x-2 py-4">
//         <div className="text-sm text-muted-foreground ">共 {table.getPageCount()} 頁</div>
//         <Button variant="outline" size="sm" onClick={prev} disabled={!table.getCanPreviousPage()}>
//           上一頁
//         </Button>
//         <Button variant="outline" size="sm" onClick={next} disabled={!table.getCanNextPage()}>
//           下一頁
//         </Button>
//         <div className=" text-sm items-center text-muted-foreground flex gap-2">
//           <span>跳至</span>
//           <Input className="w-10" onKeyPress={handleKeyPress} />
//           <span>頁</span>
//         </div>
//       </div>
//     </div>
//   )
// }
// export default XwyaTable