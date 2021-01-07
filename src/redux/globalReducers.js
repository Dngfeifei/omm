import { Assign } from '/api/tools'
import { 
	TOGGLE,
	START_LOADING, 
	CLOSE_LOADING, 
	RESET,
	SET_BREADCRUMB,
	SET_PANE_STATE,
	SET_PANE_ACTIVEKEY,
	GET_MENU_SUCCESS,
} from './action'

//redux状态管理原始配置数据
const globalDataStructure = {
	loading: false,
	panes: [],
	activeKey: '',
	menu: [],
	breadcrumb:[]
}
//redux状态管理action执行操作函数
export const GlobalReducer = (state = globalDataStructure, action) => {
	switch(action.type){

		case TOGGLE: return Assign(state, { collapsed: !state.collapsed})//设置菜单面板隐藏收缩

		case START_LOADING: return Assign(state, { loading: true }) //设置loading效果显示

		case CLOSE_LOADING: return Assign(state, { loading: false })//接口交互成功后取消loading显示

		case SET_PANE_STATE: return Assign(state, { panes: action.data })//设置选择过的tab标签集合

		case SET_PANE_ACTIVEKEY: return Assign(state, { activeKey: action.data })//设置当前显示标签
		
		case SET_BREADCRUMB: return Assign(state, { breadcrumb: action.data })//设置面包屑数据
		
		case GET_MENU_SUCCESS: return Assign(state, { menu: action.data })//获取导航树节点

		case RESET: return globalDataStructure//重置所有状态

		default: return state
	}
}