import http from './index'

export const listDept = (params = {}) => {
	return http.fetchGet(`/department/list`, params)
}

export const getDeptSelect = (params = {}) => {
	return http.fetchGet(`/department/select`, params)
}
//获取上级部门
export const getTopDepartment = (params = {}) => {
	return http.fetchGet(`/department/getTopDepartment`, params)
}

export const listOrgpost = (params = {}) => {
	return http.fetchGet(`/orgpost/list`, params)
}

export const selectMembers = (params = {}) => {
	return http.fetchGet(`/member/select`, params)
}

export const saveDepManager = (params = {}) => {
	return http.fetchGet(`/department/saveDepManager`, params)
}

export const listStorage = (params = {}) => {
	return http.fetchGet(`/storage/list`, params)
}
// 获得职位信息
export const getOrgLevels = (params = {}) => {
	return http.fetchGet(`/orglevel/listDoc`, params)
}
