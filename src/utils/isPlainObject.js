/**
 *
 * @param {any} obj
 * @returns {boolean} ture 表示 obj 是纯对象
 */
const isPlainObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return false
  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(obj) === proto
}

export default isPlainObject