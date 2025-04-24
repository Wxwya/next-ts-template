import { format } from 'date-fns'
// 将日期处理成中文
import { zhCN } from 'date-fns/locale'

/**
 *  yyyy-MM-dd HH:mm:ss
 * @param date 
 * @param formatStr 
 * @returns 
 */
export const  formatDate = (date:any, formatStr: string) => {
  return format( date , formatStr, { locale: zhCN })
}