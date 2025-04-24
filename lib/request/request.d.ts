export interface RequestConfig { 
  show: boolean;
  loading?: boolean;
  loadingText?: string;
  message?: string;
  excludeLock?: boolean
  lockRequest?: boolean;
  isAuth?: boolean;
  isRepeatRequest?: boolean;
}
export interface RequestDefaultOptions extends RequestInit { 
  baseURL: string;
  withToken?: boolean;
  prefix?: string;
  retryCount?: number;
  retryTimeout?: number;
  timeout?: number;
  requestHooks: RequestHooks;
  tokenPrefix?: string;
  refreshApi?: string;
  headTokenKey?: string;
  isRetry?: boolean;
  startRetry?: boolean;
  repeatRequest: boolean;
  isTimeout?: boolean;
  controller?: AbortController;
  signal?: AbortSignal;
  isLockRequest?: boolean;
  refreshTokenKey?: string;
  stateRefresh?: boolean;
  withCredentials?: boolean;
}

export interface RequestOptions { 
  params?:Record<string,any>,
  headers?:Record<string,any>,
  data?: Record<string,any>;
  url: string;
  file?: FormData;
  method?: string;
  cache?: "default"|"reload"| "no-cache" | "force-cache" | "only-if-cached" | "no-store" ;
}
/**
 *  default: 默认行为，由浏览器决定（通常会使用缓存）
 *  reload: 不使用缓存，但会更新缓存（浏览器刷新行为类似）
 *  no-store: 完全不使用缓存，也不更新缓存。每次都从服务器获取，适用于请求实时数据
 *  no-cache: 使用缓存前会向服务器验证（If-Modified-Since / ETag），只有内容变了才拉新内容
 *  force-cache: 无论是否过期都用缓存，如果没有缓存就发起请求并缓存响应
 *  only-if-cached: 仅使用缓存，且必须为同源请求。如果没有缓存，fetch 会失败（返回 type: "opaque" 的 Response）。通常很少用
 */
export interface RequestSendBodyOptions extends RequestDefaultOptions, RequestOptions {}
export interface RequestHooks {
  afterRequest<T >(data:DecryptBody<T> | EncryptionBody,config:RequestConfig,response: Response):Promise<DecryptBody<T>>;
  beforeRequest(options:RequestOptions | RequestSendBodyOptions,config:RequestConfig):Promise<RequestSendBodyOptions>;
}

export interface DecryptBody<T>  {
  code: number;
  data: T | null;
  msg: string;
}
export interface EncryptionBody {
  iv: string;
  data: string;
  key: string;
}



