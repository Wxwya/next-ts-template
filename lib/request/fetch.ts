import {  RequestConfig,   DecryptBody,RequestSendBodyOptions } from './request'
import { toast } from "react-hot-toast"
import { isClient } from '@/utils'
class FetchRequest {
  private static instance: FetchRequest
  // 单例模式，获取唯一实例
  public static getInstance(): FetchRequest {
    if (!FetchRequest.instance) {
      FetchRequest.instance = new FetchRequest()
    }
    return FetchRequest.instance
  }
  async request<T>(options: RequestSendBodyOptions, config: RequestConfig): Promise<DecryptBody<T>> {
    try {
      const timer = setTimeout(() => {
        options!.isTimeout = true
        options!.controller!.abort()
      }, options.timeout)
      const response = await fetch(options.url, options)
      clearTimeout(timer)
      const data = await response.json()
      return options.requestHooks.afterRequest<T>(data, config,response)
    } catch (err: any) {
      isClient() && toast.error(err.message)
      console.error('\x1b[33m%s\x1b[0m', `⚠️  发送请求错误:${err}`)
      if ((options.isRetry && options.retryCount && options.retryCount <= 0) || !options.isRetry) {
        return {code: 0, data: null, msg: err.message || '发送请求错误'} 
      }
    }
    if (options.isRetry &&options.retryCount && options.retryCount > 0 && options.isTimeout) {
      await new Promise((resolve) => setTimeout(resolve, options.retryTimeout))
      options.startRetry=true
      const rquestOptionsBody = await options.requestHooks.beforeRequest(options, config)
      return this.request<T>(rquestOptionsBody, config)
    }
    return {code: 0, data: null, msg: '请求失败'}
  }
}

const fetchRequest = FetchRequest.getInstance()
export default fetchRequest
