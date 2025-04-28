export const isClient = () => typeof window !== 'undefined';
export const isServer = () => !isClient();
/**
 * @author xwya
 * @since 2024-12-14
 * @description 生成随机id
 * @param  { Number } - length[随机id的长度]
 */
export const generateRandomId = (length: number = 16): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * @param basePath 需要匹配的路径
 * @returns 
 * @description 生成动态路由的匹配正则
 * * @example generateRegex('/user/:id') // /^\/user\/([^\/]+)(\/.*|\\?.*)?$/
 */
export function generateRegex(basePath) {
  // escape any special characters in the basePath
  const escapedPath = basePath.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
  
  // return the dynamic regex
  return new RegExp(`^${escapedPath}(\\/.*|\\?.*)?$`);
}