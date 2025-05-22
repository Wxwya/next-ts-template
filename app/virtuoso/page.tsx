"use client"
import React, { useState,useEffect,useRef } from 'react'
import { Virtuoso } from 'react-virtuoso';
import { generateRandomId } from '@/utils';
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
// 生成1000条假数据 ${getRandomText()}   ${generateRandomChineseText()} 
const returnData = () => { 
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = Array.from({ length: 1000 }).map((_,index) => { 
        return {
          id: generateRandomId(),
          name: `${generateRandomChineseText()}  ${index}`,
        }
      })
      resolve(data)
    }, 1000)
  })
}
export default function MarkdownPage() {
  const virtuosoRef = useRef(null);
  const [messages, setMessages] = useState([]);

  const addMessage = () => {
    setMessages((prev) => [...prev, `New Message ${prev.length + 1}`]);
  };
  const getData = async () => {
    const data = await returnData()
    setMessages(data)
  }
  useEffect(() => {
    getData()
    // 模拟异步加载初始消息
    // setTimeout(() => {
    //   const initialMessages = Array.from({ length: 50 }, (_, i) => `消息 ${i + 1}`);
    //   setMessages(initialMessages);
    // }, 100);
  }, []);
  // useEffect(() => {
  //   // 初始化数据加载后，手动滚到底部
  //   if (messages.length > 0) {
  //     virtuosoRef.current?.scrollToIndex({ index: messages.length - 12, behavior: 'auto' });
  //   }
  // }, [messages]);
  // useEffect(() => {
  //   // 模拟异步加载初始消息
  //   setTimeout(() => {
  //     const initialMessages = Array.from({ length: 50 }, (_, i) => `消息 ${i + 1}`);
  //     setMessages(initialMessages);
  //   }, 100);
  // }, []);

  return (
    <div style={{ height: '100dvh', border: '1px solid #ccc' }}>
      <Virtuoso
        ref={virtuosoRef}
        data={messages}
        itemContent={(index, item) => { 
        return <div style={{ padding: 8 }}>{item.name}</div>
        }}
        overscan={5}
      followOutput={true} // 自动滚到底部
        style={{ height: '100%' }}
        initialTopMostItemIndex={messages.length - 1}
    />
    {/* <button onClick={addMessage}>发送新消息</button> */}
  </div>
  )
}
