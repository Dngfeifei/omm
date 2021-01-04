import { put, fork, call, takeEvery, takeLatest, select } from 'redux-saga/effects'
import { hashHistory } from 'react-router'
import { message } from 'antd'
import * as ACTION from '../action'
import * as fetch from '/api/global'
import * as mgrApi from '/api/mgr'
import { handleTreeData } from '/api/tools'

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

//获得当前用户的角色集合
function* getThisrole () {
	yield takeLatest(ACTION.GET_THISROLE, function* (action) {
		let data = yield call(fetch.getThisrole)
		if (data.data) {
			const datas = data.data.roles
			yield put({type: ACTION.GET_THISROLE_SUCCESS, data: datas})
		}
	})
}

function* getMenu () {
	yield takeLatest(ACTION.GET_MENU, function* (action) {
		let data = yield call(fetch.getMenu)
		if (data.data) {
			yield put({type: ACTION.GET_MENU_SUCCESS, data: data.data})
		}
	})
}

function* getRoleTree () {
	yield takeLatest(ACTION.GET_ROLE_TREE, function* (action) {
		let data = yield call(mgrApi.getRoleTree)
		if (data.data) {
			let list = handleTreeData(data.data, 'name', 'id', 'childList')
			yield put({type: ACTION.GET_ROLE_TREE_COMPLETE, data: list})
		}
	})
}

function* getTodoCount () {
	yield takeLatest(ACTION.GET_TODOCOUNT, function* (action) {
		let data = yield call(fetch.getTodoCount)
		if (data.data) {
			yield put({type: ACTION.GET_TODOCOUNT_SUCCESS, data: data.data})
		}
	})
}

export default function* () {
	yield fork(addpane)
	yield fork(removepane)
	yield fork(getMenu)
	yield fork(getRoleTree)
	yield fork(getThisrole)
	yield fork(getTodoCount)
}