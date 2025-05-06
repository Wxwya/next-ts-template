'use client'
import Image from 'next/image'
import React, {useRef, useState,InputHTMLAttributes } from 'react'
import { uploadFile } from '@/api/system';
import toast  from 'react-hot-toast';
import XwyaViewImage from '@/components/XwyaViewImage';
import { cn } from '@/lib/utils';
type UploadFileProps = InputHTMLAttributes<HTMLInputElement> & {
  onChange: (filelist: string[]) => void
  filelist?: string[]
  maxCount?: number
  isError?:boolean
}
const XwyaUploadFile = (config:UploadFileProps) => {
  const uploadRef = useRef<HTMLInputElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { onChange, filelist=[],maxCount=1,isError, ...restConfig } = config
  const [imgIndex,setImgIndex] = useState(0)
  const onUpload = () => {
    uploadRef.current!.click()
  }
  const handleFileChange = async () => {
    const files:FileList | null = uploadRef.current!.files;
    if (files && files.length + filelist.length  > maxCount) { 
      toast.error(`最多只能上傳${maxCount}張圖片`) 
      return
    }  
    let urls:string[] = []
    if (!files) return
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadFile(formData)
      if (res.code === 200) { 
        urls.push(res.data!.url)
      }
    }
    onChange([...filelist, ...urls])
    const dataTransfer = new DataTransfer()
    uploadRef.current!.files = dataTransfer.files; 
  }
  const onDeleteImage = (index:number) => {
    onChange(filelist.filter((_, i) => i !== index))
  }
  const onViewImages = (index: number) => {
    setImgIndex(index)
    setIsOpen(true)
  }
  return (
    <div >
      <div className=' flex gap-2 flex-wrap '>
        {filelist.map((item, index) => (
          <div className='w-24 group  aspect-square relative' key={item}>
            <Image src={item} className=' aspect-square' width={96} height={96} alt='图片暂时加载失败..' />
            <div onClick={()=>onViewImages(index)} className=' absolute inset-0 bg-[rgb(0,0,0,0.3)] hidden text-gray-100 group-hover:flex items-center justify-center'>
              <div className=' flex gap-2 items-center text-sm cursor-pointer'><span className='iconify solar--eye-bold'></span>预览</div>
            </div>
            <div onClick={()=>onDeleteImage(index)} className=' w-4 aspect-square   absolute -right-1 -top-1 rounded-full flex items-center justify-center'>
              <div className='iconify solar--close-circle-bold  text-black text-xl'></div>
            </div>
        </div>
        ))}
        { filelist.length<maxCount &&<div
          onClick={onUpload}
          className={cn("w-24  aspect-square hover:bg-accent dark:bg-[--border] border border-input  border-dashed flex flex-col justify-center items-center text-zinc-300 ",isError && "border-destructive")} 
        >
          <div className="iconify solar--add-square-linear text-3xl"></div>
          <div className=" text-xs mt-2">請上傳文件</div>
        </div>    }
        
      </div>
      <input onChange={handleFileChange}  className="w-0 h-0 hidden"   {...restConfig} ref={uploadRef}  type="file"  />
      {isOpen && (
        <XwyaViewImage filelist={filelist} index={imgIndex} onChangeIndex={ setImgIndex} onChangeOpen={setIsOpen} />
      )}
    </div>
  )
}

export default XwyaUploadFile
