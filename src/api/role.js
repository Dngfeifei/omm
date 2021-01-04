import http from './index'

export const getRoleList = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	return http.fetchPost(`/role/list`, params)
}

export const deleteRole = (params = {}) => {
	return http.fetchPost(`/role/remove`, params)
}

export const getRoleTree = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	return http.fetchGet(`/role/roleTreeListByUserId`, params)
}

export const addRole = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	return http.fetchPost(`/role/add`, params)
}

export const editRole = (params = {}) => {
	return http.fetchPost(`/role/edit`, params)
}

export const getAuthTree = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	return http.fetchGet(`/menu/menuTreeListByRoleId`, params)
}

export const setAuthority = (params = {}) => {
	return http.fetchPost(`/role/setAuthority`, params)
}
