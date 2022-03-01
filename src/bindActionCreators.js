import { kindOf } from './utils/kindOf'
/**
 * 创建一个可以派发 action 的函数
 * @param {Function} actionCreator action 的创建函数
 * @param {Function} dispatch redux 的 store.dispatch
 * @returns 返回一个可以派发 action 的函数
 */
const bindActionCreator = (actionCreator, dispatch) => {
  return function (...args) {
    return dispatch(actionCreator.apply(this, args))
  }
}

/**
 * 创建可以派发 action 的函数 或 函数集合
 * @param {Object|Function} actionCreators
 * @param {Function} dispatch redux 的 store.dispatch
 * @returns 返回一个可以派发 action 的函数 或 函数集合
 */
const bindActionCreators = (actionCreators, dispatch) => {
  if (kindOf(actionCreators) === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  if (kindOf(actionCreators) !== 'object' || actionCreators === null) {
    throw new Error('actionCreators 必须是函数或者对象')
  }

  const boundActionCreators = {}
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key]
    if (kindOf(actionCreator) === 'function') {
      bindActionCreator[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}


export default bindActionCreators

