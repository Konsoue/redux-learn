import kindOf from "./utils/kindOf"

/**
 * 将外部传进来的 reducers 合成一个总的 reducers
 * @param {Object} reducers
 * @returns {Function}
 */
const combineReducers = (reducers) => {
  const reducerKeys = Object.keys(reducers)

  const resultReducer = (state = {}, action) => {
    const nextState = {}
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i]
      const reducer = reducers[key]

      const previousStateForKey = state[key] // 拿到某个 reducer 处理前对应的 state
      const nextStateForKey = reducer(previousStateForKey, action) // 拿到处理后的 state
      if (kindOf(nextStateForKey) === 'undefined') {
        throw new Error(`${key} reducer 处理结果不能是 undefined`)
      }
      nextState[key] = nextStateForKey
    }

    return nextState
  }

  return resultReducer
}


export default combineReducers