import { combineReducers } from 'redux'
import { GlobalReducer } from './globalReducers'

export default combineReducers({
	global: GlobalReducer
})