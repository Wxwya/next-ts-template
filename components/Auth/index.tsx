"use client";
import useAuth from "@/hooks/use-auth";
import { useEffect } from "react";
import { onChangeUserInfo } from '@/store/user'

const Auth = () => {
  useAuth()
  const getInfo = async () => { 
    // 获取用户信息
    // const res = await getUserInfo()
      onChangeUserInfo({username:"xwya"})
  }
  useEffect(() => { 
    getInfo()
    },[])
  return <></>
}
export default Auth;