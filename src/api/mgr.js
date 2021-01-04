import http from './index'

export const getUserList = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	return http.fetchGet(`/mgr/list`, params)
}

export const resetpassword = (params = {}) => {
	return http.fetchPost(`/mgr/reset`, params)
}

export const freezeuser = (params = {}) => {
	return http.fetchPost(`/mgr/freeze`, params)
}

export const unfreezeuser = (params = {}) => {
	return http.fetchPost(`/mgr/unfreeze`, params)
}

export const getdeptTree = (params = {}) => {
	return http.fetchPost(`/dept/tree`, params)
}

export const addUser = (params = {}) => {
	return http.fetchPost(`/mgr/add`, params)
}

export const editUser = (params = {}) => {
	return http.fetchPost(`/mgr/edit`, params)
}

export const getRoleTree = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	return http.fetchGet(`/role/roleTreeListByUserId`, params)
}

export const setRole = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	return http.fetchPost(`/mgr/setRole`, params)
}

export const changepass = (params = {}) => {
	return http.fetchPost(`/mgr/alterPwd`, params, true)
}

export const changeinitpwd = (params = {}) => {
	return http.fetchGet(`/mgr/changeInitPwd`, params)
}

export const getInitPassordInfo = (params = {}) => {
	return http.fetchGet(`/mgr/getInitPassordInfo`, params)
}

//同步-组织结构
export const syncUsers = (params = {}) => {
	return http.fetchGet(`/member/syncOrg`, params, 990000)
}

//获取OA上次同步时间
export const getOASyncDate = (params = {}) => {
	return http.fetchGet(`/mgr/getOASyncDate`, params)
}


//获得角色名
export const getRoleNames = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	return http.fetchGet(`/mgr/getRoles`, params)
}
