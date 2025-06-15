'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import useUserStore from '@/store/user'
import XwyaTooltip from '@/components/XwyaTooltip'
import XwyaChartInput from '@/components/XwyaChartInput'
import { Loader2 } from 'lucide-react'
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { generateRandomId } from '@/utils'
import usePage from '@/hooks/use-page'

function generateRandomChineseText(min = 100, max = 400): string {
  const length = Math.floor(Math.random() * (max - min + 1)) + min
  const base = 0x4e00 // 汉字的 Unicode 起始
  const range = 0x9fa5 - 0x4e00

  let result = ''
  for (let i = 0; i < length; i++) {
    const charCode = base + Math.floor(Math.random() * range)
    result += String.fromCharCode(charCode)

    // 模拟标点符号
    if (Math.random() < 0.05) {
      result += '，'
    } else if (Math.random() < 0.02) {
      result += '。'
    }
  }

  // 以句号结尾更自然
  if (!result.endsWith('。')) {
    result += '。'
  }

  return result
}
// 生成1000条假数据 ${getRandomText()}    ${generateRandomChineseText()}
const returnData = (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = Array.from({ length: 100 }).map((_, index) => {
        return {
          id: generateRandomId(),
          name: `  ${generateRandomId()}${generateRandomChineseText()} ${index}`,
        }
      })
      resolve(data)
    }, 1000)
  })
}
const ChartPage = () => {
  const virtuosoRef = useRef<VirtuosoHandle | null>(null)
  const [row, setRow] = useState<any>(null)
  const userInfo = useUserStore((state) => state.userInfo)
  const [value, setValue] = useState('')
  const isMobile = useIsMobile()
  const { data, setData, page, setPage, loading, setLoading, total, setTotal } = usePage()
  const onTest = (index: number | null) => {
    setRow(index)
  }
  const getData = async () => {
    setLoading(true)
    const res = await returnData()
    const newData = [...res, ...data]
    setData(newData)
    setTotal(newData.length)
    virtuosoRef.current?.scrollToIndex({
      index: page.pageNum === 1 ? res.length : res.length - 1,
      behavior: 'auto',
    })
    setLoading(false)
  }

  const onScroll = (e: any) => {
    if (e.target.scrollTop === 0 && !loading) {
      setPage({ ...page, pageNum: page.pageNum + 1 })
    }
  }
  useEffect(() => {
    getData()
  }, [page])

  return (
    <div className="w-full h-full flex border border-solid rounded-lg overflow-hidden">
      {(!isMobile || !row) && (
        <div className={cn(' h-full flex flex-col overflow-hidden', isMobile ? 'flex-1' : 'w-[280px] border-r border-solid ')}>
          <div className="h-16 bg-sidebar px-4 flex justify-between items-center border-b border-solid">
            <Avatar className="w-12 h-12 text-gray-500">
              <AvatarImage src={userInfo?.avatar} />
              <AvatarFallback> {userInfo?.username.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <XwyaTooltip text="刷新" open={true}>
                <span className="text-base iconify solar--traffic-broken"></span>
              </XwyaTooltip>
            </div>
          </div>
          <div className="flex-1 bg-red-300 overflow-auto">
            {Array.from({ length: 100 }).map((_, index) => (
              <div key={index} onClick={() => onTest(index)}>
                {index}
              </div>
            ))}
          </div>
        </div>
      )}

      {(row || !isMobile) && (
        <div className="flex-1 h-full flex flex-col">
          <div className="h-16 bg-sidebar border-b border-solid flex justify-between items-center px-4">
            <div className="flex gap-2 items-center">
              <Avatar className="w-12 h-12 text-gray-500">
                <AvatarImage src="" />
                <AvatarFallback> sr</AvatarFallback>
              </Avatar>
              <div className="max-w-36  truncate">sruser555555999966666666</div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            {isMobile && (
              <XwyaTooltip text="返回列表" open={true}>
                <div className="iconify solar--multiple-forward-left-bold text-lg" onClick={() => onTest(null)}></div>
              </XwyaTooltip>
            )}
          </div>
          <div className=" flex-1 overflow-hidden">
            <Virtuoso
              ref={virtuosoRef}
              data={data}
              className=""
              itemContent={(index, item) => (
                <div className={cn(index % 2 === 0 && 'justify-end', index === 0 ? 'mt-0' : 'mt-2', 'flex px-2')}>
                  <div className={cn(index % 2 === 0 && ' flex-row-reverse ', 'max-w-[45%] max-md:max-w-[75%]  flex gap-2 items-start')}>
                    <div className="w-10 h-10 rounded-full flex-shrink-0 bg-blue-400 "></div>
                    <p  className={cn("bg-sidebar  rounded-md break-all whitespace-pre-line p-2",index%2===0&&"bg-[#34C759] text-white")} >{item.name}</p>
                  </div>
                </div>
              )}
              overscan={5}
              totalCount={total}
              onScroll={onScroll}
              style={{ height: '100%' }}
              components={{
                Header: () =>
                  loading && (
                    <div className=" flex justify-center items-center">
                      {' '}
                      <Loader2 className=" animate-spin" />
                    </div>
                  ),
              }}
            />
          </div>
          <XwyaChartInput value={value} onChange={setValue} />
        </div>
      )}
    </div>
  )
}

export default ChartPage
// initialItemCount={itemCount}
// firstItemIndex={100}
// initialTopMostItemIndex={itemCount}
// increaseTopItemCount={}
// topItemCount={total}
// followOutput={true} // 自动滚到底部
