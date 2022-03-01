import { createStore, combineReducers, applyMiddleware } from '../src'
import { logMiddleware, reduxThunk } from './middleware'

const initalState = {
  home: {},
  user: {
    name: 'jack'
  },
  count: 0
}

const homeReducer = (state, action) => {
  return state
}
const userReducer = (state, action) => {
  switch (action.type) {
    case 'changeName':
      return {
        ...state,
        name: action.data
      }
    default:
      return state
  }
}

const countReducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return state + 1
    case 'decrement':
      return state - 1
    default:
      return state
  }
}

// reducers 的 key 要和 initalState 对应
const reducers = {
  home: homeReducer,
  user: userReducer,
  count: countReducer
}
// 将 reducer 组合起来
const resultReducer = combineReducers(reducers)
// 应用中间件
const enhancer = applyMiddleware(logMiddleware, reduxThunk);

const store = createStore(resultReducer, initalState, enhancer);
// 订阅 store，当 store 的数据有任何变化，就会触发
store.subscribe(() => console.log(store.getState()))

store.dispatch({ type: 'increment' })
store.dispatch({ type: 'increment' })

const asyncAction = (dispatch, state) => {
  // 异步事件执行后，再 dispatch
  setTimeout(() => {
    dispatch({ type: 'changeName', data: 'konsoue' })
  }, 2000)
}

store.dispatch(asyncAction);