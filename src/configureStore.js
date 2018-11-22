import { createStore, compose, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import isPlainObject from './isPlainObject'

export function getDefaultMiddleware() {
  return [thunk]
}

export function configureStore(options = {}) {
  const {
    reducer,
    middleware = getDefaultMiddleware(),
    devTools = true,
    preloadedState,
    enhancers = []
  } = options

  let rootReducer

  if (typeof reducer === 'function') {
    rootReducer = reducer
  } else if (isPlainObject(reducer)) {
    rootReducer = combineReducers(reducer)
  } else {
    throw new Error(
      'Reducer argument must be a function or an object of functions that can be passed to combineReducers'
    )
  }

  const middlewareEnhancer = applyMiddleware(...middleware)

  const storeEnhancers = [...enhancers, middlewareEnhancer]

  let finalCompose = devTools ? composeWithDevTools : compose

  const composedEnhancer = finalCompose(...storeEnhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancer)

  return store
}
