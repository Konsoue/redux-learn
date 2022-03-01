import compose from './compose'

/**
 * 我们使用它应用中间件，使得中间件可以调用 redux 的 store 的方法
 *
 * @param  {...Function} middlewares
 * @returns {Function} 返回的函数，用于 createStore 的第三个参数
 */
const applyMiddleware = (...middlewares) => {
  const enhancer = (createStore) => {
    const newCreateStore = (reducers, preloadState) => {
      const store = createStore(reducers, preloadState)
      // chain = [ (next) => {}, (next) => {}, ...]
      // 其中的 next 方法是我们下面将要传入的 store.dispatch
      const chain = middlewares.map(middleware => middleware(store))
      //  一系列中间件对 dispatch 的包裹，形成一个新的 dispatch。
      // 所以外界调用 store.dispatch 就是调用 newDispatch
      const newDispatch = compose(...chain)(store.dispatch)

      return {
        ...store,
        dispatch: newDispatch
      }
    }

    return newCreateStore
  }

  return enhancer
}

export default applyMiddleware