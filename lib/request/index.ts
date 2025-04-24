import HttpRequst from './http'
import { RequestHooks, RequestConfig, RequestOptions, DecryptBody, EncryptionBody,RequestDefaultOptions,RequestSendBodyOptions} from './request'
import { ContentTypeEnum,RequestCodeEnum,RequestMethodsEnum } from '@/enums/requestEnums'
import cache from '@/lib/cache'
import { TokenEnums } from '@/enums/cacheEnums'
import requestCancel from './cancel'
import lock from './lock'
import { toast } from "react-hot-toast"
import { isClient } from '@/utils'
const requestHooks: RequestHooks = {
  async beforeRequest(options: RequestOptions | RequestSendBodyOptions, config: RequestConfig): Promise<RequestSendBodyOptions>  {
    let newOptions: RequestSendBodyOptions
    if ('startRetry' in options &&  options?.startRetry) {
      --(options.retryCount!)
      options.controller = new AbortController()
      options.signal = options.controller.signal
      return options
    }
    let that = this  as unknown as HttpRequst
    newOptions = {...that.options} as RequestSendBodyOptions
    newOptions.url = `${that.options.baseURL}${that.options.prefix??''}${(options?.url??'')}`
    newOptions.headers = { ...that.options.headers, ...options?.headers }
    newOptions.method = options?.method || RequestMethodsEnum.GET
    newOptions.params = options?.params || {}
    newOptions.data = options?.data || {}
    newOptions.controller = new AbortController()
    newOptions.signal = newOptions.controller.signal
    newOptions.startRetry = false
    if (newOptions.withToken) {
      const token = cache.getCookie(TokenEnums.TOKEN_KEY)
      newOptions.headTokenKey &&((newOptions!.headers as Record<string,any>)[newOptions.headTokenKey!] =  `${newOptions?.tokenPrefix??""}${token}`) 
      if (newOptions.stateRefresh) {
        const refreshToken = cache.getCookie(TokenEnums.REFRESH_KEY)
        newOptions.refreshTokenKey && ((newOptions!.headers as Record<string,any>)[newOptions.refreshTokenKey!] = `${newOptions?.tokenPrefix??""}${refreshToken}`)
      }
    }
    if (newOptions.repeatRequest) {
      requestCancel.add(options.url, newOptions.controller)
    }
    if ((newOptions.isLockRequest || config?.lockRequest) && !config?.excludeLock &&options.data && !!Object.keys(options.data).length ) {
      newOptions.data = await lock.encryptionRequestBody(options.data)
    }
    newOptions.url += handleParamsString(options?.params || {})
    !!Object.keys(newOptions.data).length && (newOptions.body = JSON.stringify(newOptions.data))
    newOptions?.withCredentials && (newOptions.credentials = 'include')
    if (options?.file) {
      delete newOptions!.headers['Content-Type']
      // (newOptions!.headers as Record<string,any>)['Content-Type'] = ContentTypeEnum.FORM_DATA
      newOptions.body = options.file
    }
    return newOptions
  },
  async afterRequest<T>(data: DecryptBody<T>, config: RequestConfig, response:  Response):Promise<DecryptBody<T>> {
    let that = this  as unknown as HttpRequst
    if ((that.options.isLockRequest || config?.lockRequest) && !config?.excludeLock && data && !!Object.keys(data).length) {
      data = (await lock.decryptResponseBody<T>(data as unknown as EncryptionBody)) ?? {} as DecryptBody<T>
    }
    if (response && (response.status != RequestCodeEnum.SUCCESS)) {
      isClient()&&toast.error(data ? `${data.code}:${JSON.stringify(data.msg)}` : `${response.status}:${response.statusText}`)
      const text = data ? `${data.code}:${JSON.stringify(data.msg)}` : `${response.status}:${response.statusText}`
      console.error('\x1b[31m%s\x1b[0m', `❌ 状态码错误：${text || '请求错误'}`);
      return {code:data?data.code:response.status,msg:data?data.msg:response.statusText,data:null}
    }
    if (data) { 
      if (data.code === RequestCodeEnum.SUCCESS) {
        isClient()&& config?.show && toast.success(config.message || data.msg || 'ok')
      } else if (RequestCodeEnum.TOKEN_INVALID.includes(data.code)) {
        if (!that.isRefreshing&&that.options.stateRefresh && that.options.withToken&& !config?.isAuth) {
          that.isRefreshing = true        
          const res = await that.get<any>({ url: that.options?.refreshApi??'' }, {show:false,isAuth: true }) as any
          if (res?.code == RequestCodeEnum.SUCCESS) {
            cache.setCookie(TokenEnums.TOKEN_KEY, res.access_token)
            cache.setCookie(TokenEnums.REFRESH_KEY, res.refresh_token)
            !that.isStartTask && that.startTaskRequest()
          }
        }
        if (!that.options.stateRefresh || (that.options.stateRefresh && config?.isAuth) || !that.options.withToken) {
          cache.remove(TokenEnums.TOKEN_KEY)
          cache.remove(TokenEnums.REFRESH_KEY)
          that.options.stateRefresh && that.clearTasks()
          isClient() && location.reload()
        }
        return {code:data.code,msg:data.msg,data:null}
      } else if (data.code === RequestCodeEnum.ServerError) {
        isClient() && toast.error('请稍后重试....')
        console.error('\x1b[31m%s\x1b[0m', `❌ 错误：${data.msg || '请求错误'}`);
      } else {
        isClient() && toast.error(data.msg || '请求错误')
        console.error('\x1b[31m%s\x1b[0m', `❌ 请求返回错误：${data.msg || '请求错误'}`);
      }
    }
    if (!config?.isAuth&& that.options.stateRefresh) { 
      that.removeTask()
    }
    return data
  },
}
const handleParamsString = (params: Record<string, any>): string => {
  return Object.keys(params).length > 0
    ? '?' +
        Object.keys(params)
          .map((key) => `${key}=${encodeURIComponent(params[key])}`)
          .join('&')
    : ''
}
const defaultOptions:RequestDefaultOptions  = {
  baseURL: process.env.NEXT_PUBLIC_APP_URL as string,
  prefix:"",
  headers: {
    'Content-Type': ContentTypeEnum.JSON,
  },
  withCredentials:false, // 是否开启cookie
  withToken: true, // 是否携带token
  requestHooks: requestHooks, // 请求拦截器
  retryCount: 2, // 重试次数
  retryTimeout: 5000, // 重试机制时间
  tokenPrefix: 'Bearer ', // token前缀
  headTokenKey: 'Authorization', // 携带头部Token key名称
  refreshTokenKey: 'Refresh-Token',
  refreshApi: '/system/refresh', // 刷新token接口
  stateRefresh: true, // 是否双token
  timeout: 5000, // 超时机制
  isRetry: true, // 是否开启重试
  repeatRequest: true, // 去重复请求机制
  isLockRequest: false, // 是否请求加密
}
export const createRequest = (options?:RequestDefaultOptions):HttpRequst => {
  return new HttpRequst({
    ...defaultOptions,
    ...options,
  })
}

const request = createRequest()
export default request
