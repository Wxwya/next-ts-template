export enum ContentTypeEnum {
  // json
  JSON = "application/json",
  // form-data   上传资源（图片，视频）
  FORM_DATA = "multipart/form-data",
}

export enum RequestMethodsEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export const RequestCodeEnum = {
  SUCCESS: 200,
  FAILED:400, 
  TOKEN_INVALID:[1001, 1002, 1003,1004,1005,401],
  SERVER_ERROR: 500, 
  TOKEN_TIMEOUT: 1002,
}

export enum RequestErrMsgEnum {
  ABORT = "request:fail abort",
  TIMEOUT = "request:fail timeout",
}
