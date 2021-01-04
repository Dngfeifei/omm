import http from './index'

export const getMenuTree = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	return http.fetchPost(`/menu/allTree`, params)
}

export const addMenu = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	return http.fetchPost(`/menu/add`, params, true)
}

export const editMenu = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	return http.fetchPost(`/menu/edit`, params, true)
}

export const deleteMenu = (params = {}) => {
	return http.fetchGet(`/menu/remove`, params)
}

