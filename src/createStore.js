import isPlainObject from "./utils/isPlainObject"
import kindOf from "./utils/kindOf"

/**
 *
 * @param {Function} reducer
 * @param {*} preloadedState  初始的 state
 * @param {Function} enhancer 增强器，applyMiddleware 的返回值。
 * @returns {Store}
 */
function createStore(reducer, preloadedState, enhancer) {

  // 如果有中间件，将 createStore 交给中间件创建，并传入 reducer, preloadedState
  if (kindOf(enhancer) !== 'undefined') {
    return enhancer(createStore)(reducer, preloadedState);
  }


  let currentReducer = reducer
  let currentState = preloadedState
  let currentListeners = []  // 当前的 listeners ，即所有监听函数
  let nextListeners = currentListeners // 在 state 数据改变前，订阅的监听函数，先放在 nextListeners，以保证 currrentListeners 数据修改前的不变性。
  let isDispatching = false  // reducers 正在执行的标志

  /**
   * 派发 action，这是改变 state 的唯一途径
   * @param {Object} action 一个纯对象，代表了将要改变什么。
   * @returns {Object} 为了方便，返回用户派发的 action
   */
  const dispatch = (action) => {
    if (!isPlainObject(action)) {
      throw new Error(`Actions 必须是纯对象。而当前 Actions 的类型是${kindOf(action)}。你可以加中间件, 来处理特殊类型`)
    }
    if (!action.type) throw new Error('Actions 必须有一个 type 属性')

    if (isDispatching) throw new Error('还不可以给 reducers 派发 action')

    try {
      // Reducers 开始处理 action
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }
    // 处理完 action, 触发监听事件
    // 先把 nextListeners 赋值给 currentListeners
    // 因为 subscribe 添加监听函数时，会将监听函数先放到 nextListeners
    // 以此来保证 currentListeners 触发前，自身的不变性
    const listeners = (currentListeners = nextListeners)
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
    return action
  }

  /**
   * 将 currentListeners 浅拷贝后，赋给 nextListeners
   */
  const ensureCanMutateNextListeners = () => {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }

  /**
   * 订阅：添加一个监听函数
   * @param {Function} listener 监听函数
   * @return {Function} 返回一个函数用于移除，这个监听函数
   */
  const subscribe = (listener) => {
    if (isDispatching) throw new Error('reducer 正在执行, 你不能调用 store.subscribe()')

    let isSubscribed = true  // 标志该 listener 是否已经订阅
    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    // 返回一个取消订阅的函数
    return function unsubscribe() {
      if (!isSubscribed) return
      if (isDispatching) throw new Error('reducer 正在执行, 你不能调用 unsubscribe()')
      isSubscribed = false
      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
      currentListeners = null // 这里赋值为 null，释放内存。不会影响数据改变后，调用监听函数的
    }
  }
  /**
   * 读取被 store 管理的 state 树
   * @returns {any} 在你的项目中，目前的 state 树
   */
  const getState = () => {
    if (isDispatching) throw new Error('reducer 正在执行, 你不能调用 store.getState()')

    return currentState
  }

  /**
   * 替换 reducer
   * @param {Function} nextReducer
   */
  const replaceReducer = (nextReducer) => {
    currentReducer = nextReducer
  }


  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
  }
}

export default createStore