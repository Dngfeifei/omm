import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'

import reducer from './reducers'
import sagas from './sagas'

const sagaMiddleware = createSagaMiddleware()

let store = createStore(reducer, applyMiddleware(sagaMiddleware))
if (process.env.NODE_ENV == 'development') {
	store = createStore(reducer, applyMiddleware(logger, sagaMiddleware))
}

sagas.map(val => {
	sagaMiddleware.run(val)
})

export default store