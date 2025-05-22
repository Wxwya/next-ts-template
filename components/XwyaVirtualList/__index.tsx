import React, { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react'
import usePage from '@/hooks/use-page'
import { cn } from '@/lib/utils'
type XwyaVirtUalList = {
  bufferSize?: number
  isAutoHeight?: boolean
  isBottom?: boolean
  loadingEl?: React.ReactNode | (() => React.ReactNode)
  load: (pageNum: number, ...args: any[]) => void
  size?: number
  cloneEl: (row: any) => React.ReactNode
  rowKey: string
  isViewEmpty?: boolean
}
const ITEM_HEIGHT = 24
let ticking = false
function debounce(func, delay) {
  let timer = null // 存储定时器
  return function (...args) {
    // 每次触发事件时清除定时器
    if (timer) clearTimeout(timer)
    // 设置一个新的定时器
    timer = setTimeout(() => {
      func(...args) // 延时执行函数
    }, delay)
  }
}
const XwyaVirtUalList = (props: XwyaVirtUalList) => {
  const { bufferSize = 5, isAutoHeight = false, isBottom = false, loadingEl, load, size = 200, cloneEl, isViewEmpty = false, rowKey } = props
  const { data, setData, loading, setLoading, page, setPage } = usePage(size)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Record<number, number>>({})
  const [startIndex, setStartIndex] = useState(0)
  const [averageHeight, setAverageHeight] = useState(ITEM_HEIGHT)
  const [isMore, setIsMore] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [activeId, setActiveId] = useState('')
  const [resultSize, setResultSize] = useState(size)
  const [scrollNum, setScrollNum] = useState(0)
  const offset = useRef(0)

  if (!cloneEl) {
    throw new Error('cloneEl is required')
  }
  const { paddingBottom, paddingTop, visibleData } = useMemo(() => {
    let paddingTop = 0
    let paddingBottom = 0
    for (let i = 0; i < startIndex; i++) {
      paddingTop += itemRefs.current[i] ?? ITEM_HEIGHT
    }
    const visibleCount = containerRef.current ? Math.ceil(containerRef.current?.clientHeight / averageHeight) + bufferSize * 2 : 0
    const endIndex = Math.min(data.length, startIndex + visibleCount)
    for (let i = endIndex; i < data.length; i++) {
      paddingBottom += itemRefs.current[i] ?? ITEM_HEIGHT
    }
    
    const visibleData = data.slice(startIndex, endIndex)
    return { paddingBottom, paddingTop, visibleData }
  }, [data, averageHeight, startIndex])

  const computeStartIndex = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop
      let sum = 0
      let newStart = 0
      for (let i = 0; i < data.length; i++) {
        if (sum > scrollTop) {
          newStart = i
          break
        }
        sum += itemRefs.current[i] || ITEM_HEIGHT
      }
      const bufferedStart = Math.max(0, newStart - bufferSize)
      setStartIndex(bufferedStart)
    }
  }
  const computeAverageHeight = () => {
    let sum = Object.keys(itemRefs.current).length
    let sumHeight = 0
    for (let key in itemRefs.current) {
      if (itemRefs.current[key]) {
        sumHeight += itemRefs.current[key] || ITEM_HEIGHT
      }
    }
    setAverageHeight(Math.floor(sumHeight / sum))
  }
  const computeScrollTop = () => {
    let sumHeight = 0
    for (let i = 0; i < resultSize; i++) {
      sumHeight += itemRefs.current[i] || ITEM_HEIGHT
    }
    return sumHeight
  }

  const setItemRef = (el: HTMLDivElement | null, key: number) => {
    if (el) {
      itemRefs.current[key] = el.clientHeight
    }
  }

  const onLoadData = async (pageNum?: number = 1) => {
    if (loading) return
    try {
      setLoading(true)
      const reulstData = await load(pageNum)
      if (reulstData.length > 0) {
        if (isBottom) {
          setResultSize(reulstData.length)
          setData([...reulstData, ...data])
          if (pageNum != 1) {
            setActiveId(data[0].id)
          }
        } else {
          setData([...data, ...reulstData])
        }
        setPage({ ...page, pageNum })
      } else {
        if (pageNum === 1) {
          setIsEmpty(true)
        } else {
          setIsMore(false)
        }
      }
    } catch (err: any) {
      console.error(`错误提示:${err}`)
    } finally {
      setLoading(false)
    }
  }
  const handleScroll = debounce(() => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      setScrollNum((num) => num + 1)
      computeStartIndex()
      computeAverageHeight()
      if (isBottom) {
        offset.current = containerRef.current?.scrollTop
      }
      if ((containerRef.current?.clientHeight + containerRef.current?.scrollTop >=containerRef.current?.scrollHeight  && !isBottom) || (isBottom && containerRef.current?.scrollTop <= 20)) {
        isMore && !isEmpty && onLoadData(page.pageNum + 1)
      }
     
      ticking = false
    })
  }, 20)
  const handleWheel = (e: any) => {
    e.preventDefault()
    containerRef.current.scrollTop += e.deltaY * 0.5
  }
  useLayoutEffect(() => {
    if (isBottom && data.length > 0) {
      if (page.pageNum === 1) {
        containerRef.current?.scrollTo({ top: containerRef.current?.scrollHeight, behavior:'auto' })
      } else {
        containerRef.current?.scrollTo({ top: computeScrollTop() + offset.current - averageHeight, behavior: 'auto' })
      }
    }
  }, [data])
  useEffect(() => {
    if (scrollNum < 6 && isBottom && page.pageNum === 1) {
      // console.log("@@",JSON.parse(JSON.stringify(itemRefs.current)));
      
      containerRef.current?.scrollTo({ top: containerRef.current?.scrollHeight, behavior: 'auto' })
    }
  }, [scrollNum])
  useEffect(() => {
    onLoadData()
    containerRef.current.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      containerRef.current?.removeEventListener('wheel', handleScroll)
    }
  }, [])

  return (
    <div className="h-full overflow-auto relative outline-none" style={{'-webkit-overflow-scrolling':"touch"}}  ref={containerRef} onScroll={handleScroll}>
      <div style={{ paddingTop, paddingBottom }}>
        {isBottom && (
          <div>
            {loading && <div className="text-2xl text-center py-2">loading...</div>}
            {!isMore && <div className="text-2xl text-center py-2">没有更多了</div>}
          </div>
        )}
        <div className={cn(isEmpty && 'min-h-full flex items-center justify-center')}>
          {visibleData.map((item, index) => (
            <div style={{ overflowAnchor: 'none' }} style={{ backgroundColor: activeId == item.id ? 'blue' : '' }}  key={item.id} ref={(el) => setItemRef(el, index + startIndex)}>
              {cloneEl(item)}
            </div>
          ))}
          {isViewEmpty && isEmpty && (
            <div className="text-base text-center py-2 text-gray-400">
              <div className="iconify solar--bill-cross-broken text-6xl"></div>
              <div>暂无数据</div>
            </div>
          )}
        </div>
        {!isBottom && (
          <div>
            {loading && <div className="text-2xl text-center py-2">loading...</div>}
            {!isMore && <div className="text-2xl text-center py-2">没有更多了</div>}
          </div>
        )}
      </div>
    </div>
  )
}
export default XwyaVirtUalList
// {/* </div> */}

// {/* <div className=" absolute inset-0 w-full " style={{ paddingBottom, transform: `translateY(${paddingTop}px)`}}> */}
// visibility: visibility ? 'visible' :'hidden'
// containerRef.current.style.overflow="hidden"
