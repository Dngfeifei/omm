import { put, fork, call, takeLatest, select } from 'redux-saga/effects'
import * as ACTION from '../action'
import * as fetch from '/api/global'

//添加到tab已经点击选择标签，并设置当前显示
function* addpane () {
	yield takeLatest(ACTION.ADD_PANE, function* (action) {
		let panes = yield select(state => state.global.panes)
		let has = false
		let pane = {}
		let key
		panes.forEach((i, k) => {
			if ( i.key == action.data.key ) {
				has = true
				pane = i
				key = k 
			}
		})
		if (!has) {
			let nextpane = panes.concat(action.data)
			yield put({ type: ACTION.SET_PANE_STATE, data: nextpane })
		} else if(has && pane.url && pane.url != action.data.url) {
			let nextpane = panes.concat([])
			nextpane[key] = action.data
			yield put({ type: ACTION.SET_PANE_STATE, data: nextpane })
		}
		yield put({ type: ACTION.SET_PANE_ACTIVEKEY, data: action.data.key })

	})
}
//删除tab显示面板，并设置当前应显示面板
function* removepane () {
	yield takeLatest(ACTION.REMOVE_PANE, function* (action) {
		let panes = yield select(state => state.global.panes)
		let activeKey = yield select(state => state.global.activeKey)
		let nextpane = panes.concat([])
		let index
		nextpane.forEach((i, k) => {
			if (i.key == action.key) {
				index = k
			}
		})
		//console.log(index)
		if(index != undefined){
			nextpane.splice(index, 1)
			yield put({ type: ACTION.SET_PANE_STATE, data: nextpane })
			if (action.key == activeKey) {
				yield put({ type: ACTION.SET_PANE_ACTIVEKEY, data: nextpane[ index - 1 ] ? nextpane[ index - 1 ].key : nextpane[0] ? nextpane[0].key : '' })
			}
		}
	})
}
//获取导航树
function* getMenu () {
	yield takeLatest(ACTION.GET_MENU, function* (action) {
		let data = yield call(fetch.getMenu)
		if (data.data) {
			yield put({type: ACTION.GET_MENU_SUCCESS, data: data.data})
		}
	})
}

export default function* () {
	yield fork(addpane)
	yield fork(removepane)
	yield fork(getMenu)
}