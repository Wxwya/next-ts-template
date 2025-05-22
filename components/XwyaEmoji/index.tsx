import React, { useMemo} from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import zh from '@emoji-mart/data/i18n/zh.json'
import { useTheme } from 'next-themes'
import XwyaPopover from '@/components/XwyaPopover'
import XwyaButton from '@/components/XwyaButton'
import XwyaTooltip from '@/components/XwyaTooltip'
const XwyaEmoji = ({ onChange }: {onChange: (emoji: string) => void }) => {
  const { theme } = useTheme()
  // 自动判断当前主题
  const emojiTheme = useMemo(() => {
    if (theme !== 'system') return theme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [theme])
  return (
    <XwyaTooltip text='emoji 表情' open>
    <XwyaPopover contentProps={{className:"w-full p-0",side:"top",}} content={ <Picker
      data={data}
      onEmojiSelect={onChange}
      theme={emojiTheme}
      i18n={zh}
      searchPosition="none"
      previewPosition="none"
    />}>
        <XwyaButton variant='ghost' className='text-lg p-1 h-auto' icon='solar--emoji-funny-circle-bold'></XwyaButton>
      </XwyaPopover>
      </XwyaTooltip>
   
  )
}
export default XwyaEmoji

/**
 * 
 * previewPosition 设置底下预览
 * skinTonePosition 隐藏换肤
 * searchPosition 是否隐藏搜索
 * i18n 设置语言 （@emoji-mart/data/i18n下导入语言）
 * storage 设置本地存储
 * showRecent 是否显示最近使用
 */