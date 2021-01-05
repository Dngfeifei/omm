import { applyMiddleware, createStore,combineReducers } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import sagas from './sagas'
import { GlobalReducer } from './globalReducers'
//创建saga中间件
const sagaMiddleware = createSagaMiddleware()

//创建action操作库reducer
const reducer = combineReducers({global: GlobalReducer})

//创建数据仓库store
let store = createStore(reducer, applyMiddleware(sagaMiddleware))
if (process.env.NODE_ENV == 'development') {
	store = createStore(reducer, applyMiddleware(logger, sagaMiddleware))
}
//启动saga
sagas.map(val => {
	sagaMiddleware.run(val)
})

export default store