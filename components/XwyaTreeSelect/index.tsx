'use client'
import { useState, useRef, useEffect, Key } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {  ChevronDown } from "lucide-react"

type Props = {
  options?: TreeOptions[]
  className?: string
  onChange: (selectedIds: string[]) => void
  placeholder?: string
  value?: any[]
  isError?: boolean
  disabled?: boolean
}

export default function XwyaTreeSelect({ options=[], onChange,className,value,isError,disabled }: Props) {
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<any[]>(value||[])
  const [expandedIds, setExpandedIds] = useState<Set<any>>(new Set())
  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleSelect = (id: any) => {
    const newSelected = selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]
    setSelectedIds(newSelected)
    onChange(newSelected)
  }

  const toggleExpand = (id: any) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }
  const onDelete = (e: React.MouseEvent<HTMLSpanElement>, id: any) => {
    e.stopPropagation()
    const newSelected = selectedIds.filter((i) => i !== id)
    setSelectedIds((ids)=>(ids.filter((i) => i !== id)))
    onChange(newSelected)
  }
  const renderTree = (nodes: TreeOptions[], level = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedIds.has(node.value)
      const hasChildren = node.children && node.children.length > 0
      return (
        <div key={node.value as Key} className={`pl-${level * 4} mt-1`}>
          <div className="flex justify-start">
            {hasChildren && (
              <div className="hover:bg-accent flex items-center justify-center p-1 rounded" onClick={() => toggleExpand(node.value)}>
                <span className={cn('iconify', isExpanded ? 'solar--alt-arrow-down-bold' : 'solar--alt-arrow-right-bold')}></span>
              </div>
            )}
            {/* 占位对齐 */}
            {!hasChildren && level!=0 && <div className="w-12"></div>}
            <div onClick={() => toggleExpand(node.value)} className=" flex-1 hover:bg-accent rounded-md p-1 flex  items-center gap-2">
              <Checkbox onClick={(e) => e.stopPropagation()} checked={selectedIds.includes(node.value)} onCheckedChange={() => toggleSelect(node.value)} />
              <Label className="text-sm">{node.title}</Label>
            </div>
          </div>
          {hasChildren && isExpanded && renderTree(node.children!, level + 1)}
        </div>
      )
    })
  }
  const selectedLabels = getSelectedLabels(options, selectedIds)
  useEffect(() => {
    setSelectedIds(value||[])
   },[options,value])
  return (
    <div className={cn("relative w-[200px]",className) }  ref={wrapperRef}>
      <div className={cn("border rounded-md border-input px-3 text-sm  flex justify-between items-center gap-2 py-1 min-h-9  cursor-pointer bg-white",disabled&&'pointer-events-none opacity-50',isError && "border-destructive")}  onClick={() => !disabled && setOpen(!open)}>
        <div className='flex flex-wrap items-center gap-1 flex-1 shrink-0'>
        {selectedLabels.length > 0 ? (
          selectedLabels.map((item) => (
            <div key={item.value as Key} className="border px-1 flex items-center gap-2">
              <div className="truncate flex-1">{item.title}</div>
              <span className="iconify solar--close-circle-linear text-gray-400 hover:text-red-500" onClick={(e:React.MouseEvent<HTMLSpanElement>) => onDelete(e,item.value)}></span>
            </div>
          ))
        ) : (
          <span className="text-muted-foreground">请选择</span>
        )}
        </div>
        <div className=' shrink-0'>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
        
      </div>
      {open && <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border bg-white shadow-md p-1">{renderTree(options)}</div>}
    </div>
  )
}

function getSelectedLabels(data: TreeOptions[], selectedIds: any[]): TreeOptions[] {
  let result: TreeOptions[] = []
  const traverse = (nodes: TreeOptions[]) => {
    for (const node of nodes) {
      if (selectedIds.includes(node.value)) {
        result.push(node)
      }
      if (node.children) traverse(node.children)
    }
  }
  traverse(data)
  return result
}
