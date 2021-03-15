import Title from 'antd/lib/skeleton/Title'
import { put, fork, call, takeLatest, select } from 'redux-saga/effects'
import * as ACTION from '../action'
import * as fetch from '/api/global'

//添加到tab已经点击选择标签，并设置当前显示
function* addpane () {
	yield takeLatest(ACTION.ADD_PANE, function* (action) {
		let panes = yield select(state => state.global.panes) //select函数得到store中state的数据
		//判断选择的这条数据是不是已经在选择过的数据保存当中
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
		//判断选择的这条数据是不是已经在选择过的数据保存当中,如果使新增的话就添加这个数据到已有数据中，并执行操作state的action put方法
		if (!has) {
			let nextpane = panes.concat(action.data)
			yield put({ type: ACTION.SET_PANE_STATE, data: nextpane })
		} else if(has && pane.url && pane.url != action.data.url) {
			let nextpane = panes.concat([])
			nextpane[key] = action.data
			yield put({ type: ACTION.SET_PANE_STATE, data: nextpane })
		}
		//判断选择的这条数据是不是已经在选择过的数据保存当中,如果使新增的话就添加这个数据到已有数据中
		yield put({ type: ACTION.SET_PANE_ACTIVEKEY, data: action.data.key })
		//生成面包屑显示内容
		yield put({ type: ACTION.SET_BREADCRUMB, data: action.data.breadcrumb})

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
				let data = nextpane[ index - 1 ] ? nextpane[ index - 1 ] : nextpane[0] ? nextpane[0] : '';
				yield put({ type: ACTION.SET_PANE_ACTIVEKEY, data:data.key})
				yield put({ type: ACTION.SET_BREADCRUMB, data: data.breadcrumb})//改变面包屑数据
			}
		}
	})
}
function* tabChange(){
	yield takeLatest(ACTION.SET_PANE, function* (action) {
		let panes = yield select(state => state.global.panes)
		let breadcrumb,key
		panes.forEach((i, k) => {
			if (i.key == action.data) {
				breadcrumb = i.breadcrumb
				key = action.data
			}
		})
		yield put({ type: ACTION.SET_PANE_ACTIVEKEY, data: key})
		yield put({ type: ACTION.SET_BREADCRUMB, data: breadcrumb})//改变面包屑数据
	})
}
//获取导航树
function* getMenu () {
	yield takeLatest(ACTION.GET_MENU, function* (action) {
		let data = action.data == 1 ? yield call(fetch.getMenu2) : yield call(fetch.getMenu);
		let panes = yield select(state => state.global.panes)
		if (data && data.data) {
			yield put({type: ACTION.GET_MENU_SUCCESS, data: data.data})
		}
		if(panes.length){
			let nextpane = [];
			panes.forEach((item,index)=>{
				sortData(item,data.data,nextpane);
			})
			yield put({ type: ACTION.SET_PANE_STATE, data: nextpane })//重新渲染已选择pane
		}
	})
}
//递归
function sortData(pane,newTree,nextpane){
	newTree.some((item,index)=>{
		if(item.id == pane.key){
			pane.title = item.resourceName;
			pane.url = item.resourcePath;
			nextpane.push(pane);
		}else{
			if(item.children && item.children.length){
				sortData(pane,item.children,nextpane);
			}
		}
	})
}
//更新已处理工单状态
function *setWorkStatus(){
	yield takeLatest(ACTION.SET_WORKSTATUS, function* (action) {
		let panes = yield select(state => state.global.panes) //select函数得到store中state的数据
		//判断选择的这条数据是不是已经在选择过的数据保存当中
		let pane = {}
		let key
		panes.forEach((i, k) => {
			if ( i.key == action.data.key ) {
				pane = i
				key = k 
			}
		})
		//修改当前板面信息数据
		let nextpane = [...panes]
		nextpane[key] = {...pane,...action.data.data}
		yield put({ type: ACTION.SET_PANE_STATE, data: nextpane })
		//判断选择的这条数据是不是已经在选择过的数据保存当中,如果使新增的话就添加这个数据到已有数据中
		yield put({ type: ACTION.SET_PANE_ACTIVEKEY, data: action.data.data.key })

	})
}
export default function* () {
	yield fork(addpane)
	yield fork(removepane)
	yield fork(getMenu)
	yield fork(tabChange)
	yield fork(setWorkStatus)
}