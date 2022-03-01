
const logMiddleware = (store) => (next) => (action) => {
  console.log('logMiddleware');
  return next(action);
}

const reduxThunk = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
}

export {
  logMiddleware,
  reduxThunk
}