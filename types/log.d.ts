declare namespace Log { 
  interface LoggerInfo {
    id: number;
    status_code: number;
    ip: string;
    method: string;
    path: string;
    error_content: string;
    file: string;
    line: number;
    create_time?: string;  
  }
  type GetLoggerListApi = {
    list: LoggerInfo[];
    total:number
  }
}