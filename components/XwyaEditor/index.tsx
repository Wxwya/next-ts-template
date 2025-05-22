'use client'
import React, { useEffect, useState } from 'react'
import '@wangeditor/editor/dist/css/style.css'
import "@/styles/editor.css"
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { cn } from '@/lib/utils'
import { uploadFile } from '@/api/system'
type XwyaEditorProps = {
  value: string
  onChange: (value: string) => void
  view?:boolean
}
const XwyaEditor = (props: XwyaEditorProps) => {
  const { value, onChange,view=true } = props
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  const toolbarConfig: Partial<IToolbarConfig> = {} 
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        customUpload: async (file, insertFn) => {
          onLoadFile(file, insertFn)
        }
      },
      uploadVideo: {
        customUpload: async (file, insertFn) => {
          onLoadFile(file, insertFn)
        }
      }
      
    },

  }
  const onLoadFile = async (file: any, insertFn: any) => { 
    const formData = new FormData()
    formData.append('file', file)
    const res = await uploadFile(formData)
      if (res.code === 200) {
        insertFn(res.data!.url, '', res.data!.url)
      }
  }

  useEffect(() => { 
    return () => {
      if (editor) {
        editor.destroy()
        setEditor(null)
      }
    }
  },[])
  return (
    <div className='h-full  flex border border-sidebar-border border-solid'>
      <div className='h-full flex-1 flex flex-col'>
        <Toolbar
          className={cn(view && "border-r border-solid border-sidebar-border") }
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
        
      />
        <Editor
          className={ cn('flex-1 !bg-[hsl(var(--background))]',view&&'border-r border-solid border-sidebar-border')}
          defaultConfig={editorConfig}
          value={value}
          onCreated={setEditor}
          onChange={(editor) => onChange(editor.getHtml())}
          mode="default"
          style={{ height: '500px', overflowY: 'hidden' }}
        />
      </div>
      { view &&<div className='h-full w-1/3 p-2' dangerouslySetInnerHTML={{ __html: value }}>
      </div>}
    </div>
  )
}
export default XwyaEditor