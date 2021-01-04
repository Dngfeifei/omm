import { Assign } from '/api/tools'
import { 
	START_LOADING, 
	CLOSE_LOADING, 
	RESET,
	SET_PANE_STATE,
	SET_PANE_ACTIVEKEY,
	GET_MENU_SUCCESS,
	TOGGLE,
	GET_ROLE_TREE_COMPLETE,
	GET_THISROLE_SUCCESS,
	GET_TODOCOUNT_SUCCESS,
} from '../action'


const globalDataStructure = {
	loading: false,
	panes: [],
	activeKey: '',
	menu: [],
	collapsed: false,
	roleTree: [],
	cancelstate: false,
	outcancelstate: false,
	tableedit: {state: false, item: {}},
	thisrole: [],
	todoCount: 0,
}

export const GlobalReducer = (state = globalDataStructure, action) => {
	switch(action.type){
		
		case TOGGLE: return Assign(state, { collapsed: !state.collapsed})

		case START_LOADING: return Assign(state, { loading: true })
		case CLOSE_LOADING: return Assign(state, { loading: false })

		case SET_PANE_STATE: return Assign(state, { panes: action.data })
		case SET_PANE_ACTIVEKEY: return Assign(state, { activeKey: action.data })

		case GET_MENU_SUCCESS: return Assign(state, { menu: action.data })
		case GET_ROLE_TREE_COMPLETE: return Assign(state, { roleTree: action.data})

		case GET_THISROLE_SUCCESS: return Assign(state, { thisrole: action.data })

		case GET_TODOCOUNT_SUCCESS: return Assign(state, {todoCount: action.data })

		case RESET: return globalDataStructure

		default: return state
	}
}