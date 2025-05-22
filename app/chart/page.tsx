"use client"
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import useUserStore from "@/store/user"
import XwyaTooltip from '@/components/XwyaTooltip'
import XwyaChartInput from '@/components/XwyaChartInput'
import XwyaVirtUalList from '@/components/XwyaVirtualList'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { generateRandomId } from '@/utils'
// function getRandomText(minWords = 20, maxWords = 50) {
//   const words = [
//     "你好", "今天", "天气", "不错", "一起", "去", "公园", "看看", "电影", "学习", "聊天",
//     "React", "项目", "Vue", "很棒", "JavaScript", "写代码", "吃饭", "休息", "听歌",
//     "旅游", "读书", "运动", "健身", "睡觉", "旅行", "美食", "电影", "音乐", "游戏",
//     "编程", "学习", "工作", "生活", "娱乐", "旅行", "美食", "电影", "音乐", "游戏",
//     "编程", "学习", "工作", "生活", "娱乐", "旅行", "美食", "电影", "音乐", "游戏",
//   ]
//   const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords
//   let result = []
//   for (let i = 0; i < wordCount; i++) {
//     const randIndex = Math.floor(Math.random() * words.length)
//     result.push(words[randIndex])
//   }
//   return result.join(' ')
// }
function generateRandomChineseText(min = 200, max = 600): string {
  const length = Math.floor(Math.random() * (max - min + 1)) + min;
  const base = 0x4e00; // 汉字的 Unicode 起始
  const range = 0x9fa5 - 0x4e00;

  let result = '';
  for (let i = 0; i < length; i++) {
    const charCode = base + Math.floor(Math.random() * range);
    result += String.fromCharCode(charCode);

    // 模拟标点符号
    if (Math.random() < 0.05) {
      result += '，';
    } else if (Math.random() < 0.02) {
      result += '。';
    }
  }

  // 以句号结尾更自然
  if (!result.endsWith('。')) {
    result += '。';
  }

  return result;
}
// 生成1000条假数据 ${getRandomText()}    ${generateRandomChineseText()}
const returnData = () => { 
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = Array.from({ length: 200 }).map((_,index) => { 
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
  const [row, setRow] = useState<any>(null)
  const userInfo = useUserStore((state) => state.userInfo)
  const [value,setValue] = useState('')
  const isMobile = useIsMobile()
  const onTest = (index:number|null) => { 
     setRow(index)
  }
  const getData = async (pageNum?: number) => { 
    const res = await returnData()
    return pageNum > 2 ? res.slice(0, 50) : res
  }

  return (
    <div className='w-full  flex border border-solid rounded-lg overflow-hidden' style={{height:'100dvh'}}>
      { (!isMobile || !row) &&  <div className={cn(' h-full flex flex-col overflow-hidden',isMobile?'flex-1':'w-[280px] border-r border-solid ')} >
        <div className='h-16 bg-sidebar px-4 flex justify-between items-center border-b border-solid'>
          <Avatar className='w-12 h-12 text-gray-500'> 
            <AvatarImage src={userInfo?.avatar} />
            <AvatarFallback> {userInfo?.username.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className='flex items-center gap-2'>
            <XwyaTooltip text='刷新' open={true} >
            <span className='text-base iconify solar--traffic-broken'></span>
            </XwyaTooltip>
          </div>
        </div>
        <div className='flex-1 bg-red-300 overflow-auto'>
          {Array.from({ length: 100 }).map((item, index) => (
            <div key={index} onClick={()=>onTest(index)}>{ index}</div>
          ))}
        </div>
      </div>}
     
      {(row || !isMobile) && <div className='flex-1 h-full flex flex-col'>
        <div className='h-16 bg-sidebar border-b border-solid flex justify-between items-center px-4'>
          <div className='flex gap-2 items-center'>
            <Avatar className='w-12 h-12 text-gray-500'> 
            <AvatarImage src="" />
            <AvatarFallback> sr</AvatarFallback>
            </Avatar>
            <div className='max-w-36  truncate'>sruser555555999966666666</div>
            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
          </div>
          { isMobile&&  <XwyaTooltip text='返回列表' open={true} >
            <div className='iconify solar--multiple-forward-left-bold text-lg' onClick={()=>onTest(null)}></div>
          </XwyaTooltip>}
        
        </div>
        {/* isBottom  */}
        <div className=' flex-1 overflow-hidden'>
          <XwyaVirtUalList  isBottom load={getData}  cloneEl={(row) => <div>
            { row.name}
          </div>
          } /> 
          
        </div>
        <XwyaChartInput   value={value} onChange={setValue} />
        {/* <div className='flex'></div> */}
      </div>} 
    </div>
  )
}

export default ChartPage