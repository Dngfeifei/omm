import http from './index'

export const GetRoleTree = () => {
	return http.fetchGet(`/securityRoleCategories/tree`)
}
export const AddRoleGroup = (params = {}) => {
	return http.fetchPost(`/securityRoleCategories`, params)
}
export const EditRoleGroup = (params = {}) => {
	return http.fetchPut(`/securityRoleCategories`, params)
}
export const DelRoleGroup = (params = {}) => {
	return http.fetchGet(`/securityRoleCategories/delete`, params)
}
export const GetRole = (params = {}) => {
	return http.fetchGet(`/securityRoles`, params)
}
export const AddRole = (params = {}) => {
	return http.fetchPost(`/securityRoles`, params,true)
}
export const EditRole = (params = {}) => {
	return http.fetchPut(`/securityRoles`, params,true)
}
export const DelRole = (params = {}) => {
	return http.fetchGet(`/securityRoles/deleteBacth`, params)
}


// 资源树查询
export const GetResourceTree = _ => {
	return http.fetchGet(`/sysResources/tree`, true)
}