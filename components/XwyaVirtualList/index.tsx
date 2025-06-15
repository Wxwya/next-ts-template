import React, { useState, useRef, useEffect, useMemo,Suspense } from 'react'
import usePage from '@/hooks/use-page'
import { cn } from '@/lib/utils'

type XwyaVirtUalListProps = {
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
const MaxNum = 15
// function throttle<T extends (...args: any[]) => any>(
//   func: T,
//   wait: number,
//   options: { leading?: boolean; trailing?: boolean } = {}
// ): T {
//   let lastExec = 0
//   let timer: ReturnType<typeof setTimeout> | null = null
//   let lastArgs: any[] | null = null
//   const { leading = true, trailing = true } = options

//   // 先声明一个变量，不要用“函数声明”或“函数表达式具名”来避免提前引用
//   const throttled = function (this: any, ...args: any[]) {
//     const now = Date.now()
//     if (!leading && lastExec === 0) {
//       lastExec = now
//     }
//     const remaining = wait - (now - lastExec)
//     lastArgs = args

//     if (remaining <= 0) {
//       if (timer) {
//         clearTimeout(timer)
//         timer = null
//       }
//       lastExec = now
//       func.apply(this, args)
//     } else if (trailing && !timer) {
//       timer = setTimeout(() => {
//         lastExec = leading ? Date.now() : 0
//         timer = null
//         func.apply(this, lastArgs!)
//       }, remaining)
//     }
//   }

//   // 这里才给它加上 cancel 方法
//   ;(throttled as any).cancel = () => {
//     if (timer) {
//       clearTimeout(timer)
//       timer = null
//     }
//     lastExec = 0
//     lastArgs = null
//   }

//   return throttled as T
// }
/**
 * 简单版 throttle：在每个 wait 间隔内最多执行一次 func
 * @param func  要节流的函数
 * @param wait  节流间隔（毫秒）
 */
function throttle<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let lastExec = 0
  return function(this: any, ...args: any[]) {
    const now = Date.now()
    if (now - lastExec >= wait) {
      lastExec = now
      func.apply(this, args)
    }
  } as T
}
// 防抖
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function(this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
      
    }, wait)
  } as T
}
  function throttleWithDebounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let lastExec = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  return function(this: any, ...args: any[]) {
    const now = Date.now()
    const remaining = wait - (now - lastExec)

    // 如果到了下一次节流周期，就立即执行
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      lastExec = now
      func.apply(this, args)
    }
    // 否则在周期结束后再执行一次
    else if (!timer) {
      timer = setTimeout(() => {
        lastExec = Date.now()
        timer = null
        func.apply(this, args)
      }, remaining)
    }
  } as T
}
let isScrolling = false
const XwyaVirtUalList = (props: XwyaVirtUalListProps) => {
  const { bufferSize =5 ,  isBottom = false, loadingEl, load, size = 100000, cloneEl, isViewEmpty = false, rowKey } = props

  const { data, setData, loading, setLoading, page, setPage } = usePage(size)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Record<number, number>>({})
  const [startIndex, setStartIndex] = useState(0)
  // const [averageHeight, setAverageHeight] = useState(ITEM_HEIGHT)
  const averageHeight= useRef(ITEM_HEIGHT)
  const [isMore, setIsMore] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [resultSize, setResultSize] = useState(size) // 记录当前渲染的条数
  // const [loadingData, setLoadingData] = useState(false) // 加载状态
  const [isMoveBottom, setIsMoveBottom] = useState(false) // 判断是否已经触底
  const [activeId, setActiveId] = useState('')
 
  const { paddingBottom, paddingTop, visibleData } = useMemo(() => {
    let paddingTop = 0
    let paddingBottom = 0
    for (let i = 0; i < startIndex; i++) {
      paddingTop += itemRefs.current[i] ?? ITEM_HEIGHT
    }
    const visibleCount = containerRef.current ? Math.ceil(containerRef.current.clientHeight / averageHeight.current): 0
    const endIndex = Math.min(data.length, startIndex + visibleCount+bufferSize)
    for (let i = endIndex; i < data.length; i++) {
      paddingBottom += itemRefs.current[i] ?? ITEM_HEIGHT
    }
    const visibleData = data.slice(startIndex, endIndex)
    return { paddingBottom, paddingTop, visibleData }
  }, [data,  startIndex])
  // averageHeight,
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
  // const throttleComputeStartIndex = useMemo(() => throttleWithDebounce(computeStartIndex, 20), [data])

  const computeAverageHeight = () => {
    let sumHeight = 0
    let count = 0
    for (let key in itemRefs.current) {
      if (itemRefs.current[key]) {
        sumHeight += itemRefs.current[key]
        count += 1
      }
    }
    averageHeight.current = count > 0 ? Math.floor(sumHeight / count) : ITEM_HEIGHT
    
    // setAverageHeight(count > 0 ? Math.floor(sumHeight / count) : ITEM_HEIGHT)
  }
 const computeScrollTop = () => {
    let sumHeight = 0
    for (let i = 0; i < resultSize-1; i++) {
      sumHeight += itemRefs.current[i] || ITEM_HEIGHT
    }
    return sumHeight
  }
  const onLoadData = async (pageNum: number = 1) => {
    if (loading) return // 如果正在加载数据，则不再重复加载
    try {
      setLoading(true) // 开始加载数据
      const resultData = await load(pageNum)
      if (resultData.length > 0) {
        if (isBottom) {
          setResultSize(resultData.length)
          setData((prevData) => [...resultData,...prevData ])
          setPage({ ...page, pageNum })
          if (pageNum != 1) {
            setActiveId(data[0].id)
          }
        } else {
          setData([...resultData,...data])
          setPage({ ...page, pageNum })
        }
      } else {
        if (pageNum === 1) {
          setIsEmpty(true)
        } else {
          setIsMore(false)
        }
      }
    } catch (err: any) {
      console.error(`错误提示: ${err}`)
    } finally {
      setLoading(false) // 数据加载完成
    }
  }

  const handleScroll =(e:any) => {
    if (!containerRef.current || loading||isScrolling ) return
    // 标记滚动条正在被拖动
    isScrolling=true
    // 使用 requestAnimationFrame 优化滚动性能
    requestAnimationFrame(() => {
      const scrollTop = containerRef.current!.scrollTop
      const scrollHeight = containerRef.current!.scrollHeight
      const clientHeight = containerRef.current!.clientHeight
      if (isMore && !loading && ((!isBottom && scrollTop + clientHeight >= scrollHeight) || (isBottom && scrollTop <= 0))) {
        onLoadData(page.pageNum + 1)
      }
      computeStartIndex()
      isScrolling=false
    })
  }
const debounceComputeAverageHeight = useMemo(() => {
  return debounce(computeAverageHeight, 500)
}, [])
  // 为每个 item 元素设置高度
  const setItemRef = (el: HTMLDivElement | null, key: number) => {
    if (el) {
      itemRefs.current[key] = el.clientHeight
      debounceComputeAverageHeight()
    }
  }
  const onLoadMoveBottom = () => { 
    if (isMoveBottom) { 
      if (page.pageNum != 1) { 
            containerRef.current?.scrollTo({ top: computeScrollTop(), behavior: 'auto' })
      }
      return 
    }
    requestAnimationFrame(() => { 
      const dom = document.querySelector(`[data-index="${data.length - 1}"]`)
      if (dom) { 
        setIsMoveBottom(true)
         containerRef.current!.scrollTop = containerRef.current?.scrollHeight
      }
      if (!isMoveBottom && page.pageNum === 1&&!dom) { 
        containerRef.current!.scrollTop = containerRef.current?.scrollHeight
        onLoadMoveBottom()
      }
    })
   
  }
    const handleWheel = (e: any) => {
    e.preventDefault()
    containerRef.current.scrollTop += e.deltaY * 0.5
  }
  useEffect(() => {
    onLoadData()
    containerRef.current?.addEventListener('wheel', handleWheel)
    return () => {
      containerRef.current?.removeEventListener('wheel', handleWheel)
    }
  }, [])
  useEffect(() => {
    if (isBottom && data.length > 0) { 
        onLoadMoveBottom()
    }
  }, [data])

  return (
    // style={{ '-webkit-overflow-scrolling': 'touch' }}
    <div
      className="h-full overflow-auto relative outline-none"
      ref={containerRef}
      onScroll={handleScroll} // 通过 requestAnimationFrame 优化滚动
    >
      <div style={{ transform: `translateY(${paddingTop}px)`, paddingBottom, overflowAnchor: 'none' }}>
         {isBottom && (
          <div>
            {loading && <div className="text-2xl text-center py-2">loading...</div>}
            {!isMore && <div className="text-2xl text-center py-2">没有更多了</div>}
          </div>
        )}
        <div style={{opacity: isBottom && !isMoveBottom ? 0 : 1,}} className={isEmpty ? 'min-h-full flex items-center justify-center' : ''}>
          {visibleData.map((item, index) => (
            <div style={{ overflowAnchor: 'none', backgroundColor: activeId == item.id ? 'blue' : '' }} data-height={itemRefs.current[index + startIndex]} key={item.id} data-index={index + startIndex} ref={(el) => setItemRef(el, index + startIndex)}>
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
