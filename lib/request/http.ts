

import { RequestOptions, RequestConfig,DecryptBody,RequestDefaultOptions } from "./request"
import { RequestMethodsEnum } from "@/enums/requestEnums"
import fetchRequest from "./fetch"

class HttpRequst { 
  taskQueue: Function[] = [] // 任务队列
  isRefreshing: boolean = false // 是否开启鉴权
  isStartTask: boolean = false // 是否开启循环任务
  options:RequestDefaultOptions   // http 配置
  constructor(options:RequestDefaultOptions) { 
    this.options = options
    if (this.options.requestHooks.beforeRequest) {
      this.options.requestHooks.beforeRequest = this.options.requestHooks.beforeRequest.bind(this);
    }
    if (this.options.requestHooks.afterRequest) {
      this.options.requestHooks.afterRequest = this.options.requestHooks.afterRequest.bind(this);
    }
  }
  startTaskRequest(){
    this.isStartTask = true
    while (this.taskQueue.length > 0) { 
      if (!this.isRefreshing) {
        continue
      }
      const task = this.taskQueue.shift();
      if (task) {
        task()
      }
    }
    this.isStartTask = false
    this.isRefreshing = false
  }
  get<T>(options: RequestOptions, config?: RequestConfig):Promise<DecryptBody<T>> { 
    return this.request<T>({ ...options, method: RequestMethodsEnum.GET }, config)
  }
  post<T>(options: RequestOptions, config?: RequestConfig):Promise<DecryptBody<T>> { 
    return this.request<T>({ ...options, method: RequestMethodsEnum.POST }, config)
  }
  put<T>(options: RequestOptions, config?: RequestConfig):Promise<DecryptBody<T>> {
    return this.request<T>({ ...options, method: RequestMethodsEnum.PUT }, config)
   }
  delete<T>(options: RequestOptions, config?: RequestConfig):Promise<DecryptBody<T>> { 
    return this.request<T>({ ...options, method: RequestMethodsEnum.DELETE }, config)
  }
  uploadFile<T>(options: RequestOptions, config?: RequestConfig):Promise<DecryptBody<T>>  {
    return this.request<T>({ ...options, method: RequestMethodsEnum.POST }, config)
  }

  private request<T>(options: RequestOptions, config: RequestConfig |undefined): Promise<DecryptBody<T>> { 
    if (!config) { 
      config= {show:false}
    }
    return new Promise(async (resolve, _) => { 
      if (this.options.withToken && this.options.stateRefresh) {
        !config?.isAuth && this.addTask<T>(options, config,resolve)
      }
      let bodyOptions = await this.options.requestHooks.beforeRequest(options, config)
      const req = await fetchRequest.request<T>(bodyOptions, config)
      if (!this.isRefreshing || config?.isAuth) { 
        resolve(req)
      }
    })
  }
  addTask<T>(options: RequestOptions, config: RequestConfig,resolve: any) {
    let task = async () => { 
      let bodyOptions = await this.options.requestHooks.beforeRequest(options, config)
      resolve(fetchRequest.request<T>(bodyOptions, config))
    }
    this.taskQueue.push(task)
   }
  clearTasks() { 
    this.taskQueue = []
    this.isStartTask = false
    this.isRefreshing = false
  }
  removeTask() { 
    this.taskQueue.pop()
  }
  
}

export default HttpRequst