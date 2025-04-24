import React from 'react'
import { Card, CardContent,  CardHeader, CardTitle } from "@/rely/ui_rely"
import LoginFrom from "./loginForm"

const Login = () => {
  return (
    <div className=" relative p-10 h-screen ">
      <div className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  ">
        <Card className="w-[350px] shadow-md animate-dropAndZoomOnce">
          <CardHeader>
            <CardTitle className=" text-center">
              next-ts-templte 后台管理系统
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoginFrom  />
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
export default Login
