


/**
 * @param {string} path
 * @returns {Boolean}
 */
// 判断是不是外部超链接
export function isExternal(path:string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
 export function validUsername(str:string) {
  const valid_map = ['admin', 'editor','xwya']
  return valid_map.indexOf(str.trim()) >= 0
}