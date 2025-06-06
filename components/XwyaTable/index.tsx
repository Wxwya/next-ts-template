'use client'
import React, { useEffect, useMemo } from 'react'
import type { Key } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import XwyaTooltip from '@/components/XwyaTooltip'
import { PageType } from '@/hooks/use-page'
import { cn } from '@/lib/utils'
import XwyaPagination from '@/components/XwyaPagination'
import XwyaPopover from '@/components/XwyaPopover'
import { Input, Button, Label, Checkbox } from '@/rely/ui_rely'
export type TableColumns<T = any> = {
  id?: string
  key?: keyof T
  header: React.ReactNode | (() => React.ReactNode | string) | string
  cell?: React.ReactNode | ((item: T, index: number) => React.ReactNode | string) | string
  className?: string
  tooltip?: boolean
  filter?: boolean
  sort?: boolean
  search?: boolean
  filterOptions?: GlobalOptions<string | number>[]
}

type XwyaTableProps<T> = {
  data: T[]
  columns: TableColumns<T>[]
  total?: number
  onChange?: (currentPage: number, pageSize: number) => void
  page?: PageType
  loading?: boolean
  className?: string
  rowKey?: string
  flex?: boolean
}
type SortType = 'asc' | 'desc' | undefined

const funcIcon = {
  filter: 'iconify solar--code-2-bold',
  sort: 'iconify solar--sort-vertical-linear',
  search: 'iconify solar--magnifer-linear',
}
let textMap = {
  asc: '升序',
  desc: '降序',
}
type FuncIconProps<T> = {
  map: any
  mapKey: keyof T
  set: React.Dispatch<React.SetStateAction<Record<keyof any, any>>>
  options?: GlobalOptions<string | number>[]
}
function TableSearch<T>(props: FuncIconProps<T>) {
  const { map, mapKey, set } = props
  const [search, setSearch] = React.useState<string>('')
  const onSearch = () => {
    set((prev) => ({ ...prev, [mapKey]: search }))
  }
  const onReset = () => {
    setSearch('')
    set((prev) => ({ ...prev, [mapKey]: '' }))
  }
  useEffect(() => { 
    if (!map[mapKey]) { 
      setSearch('')
    }
  },[map])
  return (
    <XwyaPopover
      content={
        <div>
          <div className="flex flex-col gap-2">
            <Label>搜索</Label>
            <Input placeholder="请输入搜索词" value={search} onChange={(e) => setSearch(e.target.value)}></Input>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button size="sm" variant="ghost" onClick={onReset}>
              重置
            </Button>
            <Button size="sm" onClick={onSearch}>
              搜索
            </Button>
          </div>
        </div>
      }
      contentProps={{ className: 'max-w-[300px]', align: 'start' }}
    >
      <XwyaTooltip text="搜索">
        <div className={cn(funcIcon.search, 'text-gray-400')}></div>
      </XwyaTooltip>
    </XwyaPopover>
  )
}
function TableFilter<T>(props: FuncIconProps<T>) {
  const { map, mapKey, set, options = [] } = props
  const [select, setSelect] = React.useState<(string| number)[]>([])
  const onFilter = () => {
    set((prev) => ({ ...prev, [mapKey]: select }))
  }
  const onReset = () => {
    setSelect([])
    set((prev) => ({ ...prev, [mapKey]: [] }))
  }
  useEffect(() => {
    if (!map[mapKey]) { 
       setSelect([])
    }
   },[map])
  return (
    <XwyaPopover
      content={
        <div className="flex flex-col gap-3">
          <Label>筛选</Label>
          <div className="flex flex-col gap-2 pl-2 border-l">
            {options.map((item) => (
              <div key={item.value} className="flex gap-2">
                <Checkbox
                  id={`${item.value}-checkbox`}
                  onCheckedChange={(checked) => {
                    return checked
                      ? select
                        ? setSelect((perv) => ([...perv, item.value] as string[] | number[]))
                        : setSelect((_) => ([item.value] as string[] | number[]))
                      : setSelect((perv) => (perv.filter((value) => value !== item.value) as string[] | number[]))
                  }}
                  checked={(select && select?.includes(item.value)) as boolean}
                />
                <Label htmlFor={`${item.value}-checkbox`}>{item.label}</Label>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button size="sm" variant="ghost" onClick={onReset}>
              重置
            </Button>
            <Button size="sm" onClick={onFilter}>
              筛选
            </Button>
          </div>
        </div>
      }
      contentProps={{ className: 'max-w-[150px]' }}
    >
      <XwyaTooltip text="筛选">
        <div className={cn(funcIcon.filter, 'text-gray-400')}></div>
      </XwyaTooltip>
    </XwyaPopover>
  )
}
function TableSort<T>(props: FuncIconProps<T>) {
  const { map, mapKey, set } = props
  const onChangeSort = () => {
    const current = map[mapKey]
    if (current === 'asc') {
      set((prev) => ({ ...prev, [mapKey]: 'desc' }))
    }
    if (current === 'desc') {
      set((prev) => ({ ...prev, [mapKey]: undefined }))
    }
    if (!current) {
      set((prev) => ({ ...prev, [mapKey]: 'asc' }))
    }
  }
  return (
    <>
      <XwyaTooltip text={map[mapKey] ? textMap[map[mapKey]] : '默认'}>
        <div onClick={onChangeSort} className={cn(funcIcon.sort, 'text-gray-400')}></div>
      </XwyaTooltip>
    </>
  )
}
const XwyaTable = <T= any,>({ data = [], columns = [], total = 0, onChange, page, loading, className, rowKey = 'id', flex }: XwyaTableProps<T>) => {
  const [filterMap, setFilterMap] = React.useState<Partial<Record<keyof T, any[]>>>({})
  const [searchMap, setSearchMap] = React.useState<Partial<Record<keyof T, string>>>({})
  const [sortMap, setSortMap] = React.useState<Partial<Record<keyof T, SortType>>>({})
  const handleData = useMemo(() => {
    let result: T[] = [...data]
    for (let key in searchMap) {
      result = result.filter((item) => {
        if (!searchMap[key]) return true
        return item[key] ? (item[key] as string).includes(searchMap[key]) : false
      })
    }
    for (let key in filterMap) {
      result = result.filter((item) => {
        if (!filterMap[key] || !filterMap[key].length) return true
        return item[key] ? filterMap[key].some((fItem) => item[key] === fItem) : false
      })
    }
    for (let key in sortMap) {
      if (sortMap[key] === 'asc') {
        result = result.sort((a, b) => {
          if (typeof a[key] === 'string') {
            if (!isNaN(new Date(a[key] as string).getTime())) {
              return new Date(a[key]).getTime() - new Date(b[key] as string).getTime()
            }
            return (a[key] as string).localeCompare(b[key] as string)
          }
          return (a[key] as number) -(b[key] as number) 
        })
      }
      if (sortMap[key] === 'desc') {
        result = result.sort((a, b) => {
          if (typeof b[key] === 'string') {
            if (!isNaN(new Date(a[key] as string).getTime())) {
              return new Date(b[key]).getTime() - new Date(a[key] as string).getTime()
            }
            return (b[key] as string).localeCompare(a[key] as string)
          }
          return (b[key] as number) - (a[key] as number)
        })
      }
    }
    return result
  }, [filterMap, searchMap, sortMap, data])
  const onResetFunc = () => {
    setFilterMap({})
    setSearchMap({})
  }
  return (
    <>
      <div className={cn(className, flex && 'flex flex-col h-full overflow-hidden')}>
        <div className=" flex-1 overflow-hidden border border-solid rounded-lg">
          <Table className={cn('w-full', loading ? ' min-h-60 ' : '')}>
            <TableHeader className="bg-[hsl(var(--sidebar-background))] sticky left-0 top-0">
              <TableRow>
                {columns.map((item: TableColumns<T>, index: number) => (
                  <TableHead key={(item.key as Key) || (item.id as Key)} className={` py-2 font-bold ${item.className}`}>
                    <div
                      className="pr-2 flex items-center justify-between"
                      style={{ borderRight: index === columns.length - 1 ? 'none' : '1px solid hsl(var(--sidebar-border))' }}
                    >
                      <div>{typeof item.header === 'function' ? item.header() : item.header}</div>
                      <div className="flex gap-2 items-center">
                        {item.search && <TableSearch map={searchMap} mapKey={item.key as keyof T } set={setSearchMap} />}
                        {item.filter && <TableFilter map={filterMap} mapKey={item.key as keyof T} set={setFilterMap} options={item.filterOptions} />}
                        {item.sort && <TableSort map={sortMap} key={item.key as Key} mapKey={item.key as keyof T} set={setSortMap} />}
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {handleData.map((item: T, index: number) => (
                <TableRow key={(item[rowKey] || index) as Key} className="last:!border-b">
                  {columns.map((column: TableColumns<T>) => (
                    <TableCell key={(column.id as Key) || (column.key as Key) || (index as Key)} className={column.className}>
                    {column.tooltip ? (
                      <XwyaTooltip
                        text={String(
                          (column.key as string).split('.').reduce((acc, key) => (acc ? acc[key] : ''), item)
                        )}
                      >
                        {typeof column.cell === 'function'
                          ? column.cell(item, index)
                          : column.cell ?? 
                              (column.key as string).split('.').reduce((acc, key) => (acc ? acc[key] : ''), item) as string
                           }
                      </XwyaTooltip>
                    ) : (
                      typeof column.cell === 'function'
                        ? column.cell(item, index)
                        : column.cell ?? 
                            (column.key as string).split('.').reduce((acc, key) => (acc ? acc[key] : ''), item) as string
                         
                    )}
                  </TableCell>
                  ))}
                </TableRow>
              ))}

              {!loading && !!!total && !!!data.length && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
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
              {!!total && !!data.length && !handleData.length && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="">
                    <div className="flex flex-col min-h-44  gap-4 justify-center items-center ">
                      <div>是否重置组件搜索过滤功能</div>
                      <Button size="sm" onClick={onResetFunc}>
                        重置
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!!total && (
          <XwyaPagination
            prefix={`共 ${total} 条`}
            className="mt-4 shrink-0"
            currentPage={page?.pageNum!}
            pageSize={page?.pageSize!}
            onChange={onChange}
            total={total}
          />
        )}
      </div>
    </>
  )
}
export default XwyaTable