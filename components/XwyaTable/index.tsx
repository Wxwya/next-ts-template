"use client";
import React from "react";
import type { Key } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PageType } from "@/hooks/use-page";
import { cn } from "@/lib/utils";
import XwyaPagination from "@/components/XwyaPagination";
export type TableColumns<T = any> = {
  id?: string
  key?: string
  header: React.ReactNode | (()=> React.ReactNode | string) |string
  cell?: React.ReactNode | ((item: T,index:number) => React.ReactNode | string) 
  className?: string
};

type XwyaTableProps<T>= {
  data: T[]
  columns: TableColumns<T>[];
  total?: number
  onChange?: (currentPage:number,pageSize:number) => void
  page?: PageType
  loading?: boolean
  className?: string
  rowKey?:string
};

const XwyaTable =<T=any,>({data = [],columns = [],total = 0,onChange,page,loading,className,rowKey= 'id'}: XwyaTableProps<T>) => {
  return (<>
     <div className={className}>
      <div className=" flex-1">
        <Table className={cn("h-full  w-full",loading?' min-h-60 ':'') }>
          <TableHeader className="">
            <TableRow>
              {columns.map((item:TableColumns<T>,index:number) => (
                <TableHead key={item.id as Key || item.key as Key} className={` py-2 font-bold ${item.className}` }>
                  <div className="pr-2" style={{borderRight:index === columns.length - 1 ? 'none' : '1px solid hsl(var(--sidebar-border))'}}>{  typeof item.header === 'function' ? item.header() : item.header}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item:T,index:number) => (
              <TableRow key={(item[rowKey]  || index) as Key} className="last:!border-b">
                {columns.map((column:TableColumns<T>) => (
                  <TableCell
                    key={column.id as Key || column.key as Key || index as Key}
                    className={column.className}
                  >
                    {typeof column.cell === 'function'?column.cell(item,index) : column.cell || String((column.key as string).split('.').reduce((acc, key) => acc && acc[key], item))  }{" "}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {!loading && !!!total && !!!data.length && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  暂无数据.
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell className=" absolute inset-0  flex justify-center bg-[rgba(255,255,255,0.6)] dark:bg-[rgba(0,0,0,.3)] items-center  z-20">
                  正在加载...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      { !!total && <XwyaPagination prefix={`共 ${total} 条`} className="mt-4"  currentPage={page?.pageNum!} pageSize={page?.pageSize!} onChange={onChange} total={ total}  />}
    </div>
  </>
   
  )
}
export default XwyaTable;
