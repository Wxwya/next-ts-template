'use client'
import React, { useState } from 'react'
import { Tabs, TabsTrigger, TabsList } from '@/rely/ui_rely'
import XwyaEditor from '@/components/XwyaEditor'
const tabslist = [
  { label: "隐私协议", value: "privacy" },
  { label: "服务政策", value: "service" },
]
export default function EditorPage() {
  const [tabsVal, setTabsVal] = useState('privacy')
  const [value, setValue] = useState('隐私协议')
  const onTabsChange = (value: string) => {
    if ( value === 'privacy') { 
      setValue('隐私协议') // 隐私协议内容
    }
    if ( value === 'service') {
      setValue('服务政策') // 服务政策内容
    }
    setTabsVal(value)
   }

  return (
    <div className='h-full flex flex-col gap-2'>
      <Tabs value={tabsVal} onValueChange={(value)=>onTabsChange(value)} >
        <TabsList>
          {tabslist.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className='flex-1 '>
        <XwyaEditor  value={value} onChange={setValue}  />
       </div>
    </div>
  )
}
