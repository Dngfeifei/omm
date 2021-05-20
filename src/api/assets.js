import http from './index'

//获取结构树数据
export const GetRoleTree = () => {
	return http.fetchGet(`/securityRoleCategories/tree`)
}
//获取表格数据
export const GetRole = (params = {}) => {
	return http.fetchGet(`/securityRoles`, params)
}
//新增
export const AddRole = (params = {}) => {
	return http.fetchPost(`/securityRoles`, params,true)
}
//编辑
export const EditRole = (params = {}) => {
	return http.fetchPut(`/securityRoles`, params,true)
}
//删除
export const DelRole = (params = {}) => {
	return http.fetchGet(`/securityRoles/deleteBacth`, params)
}


// 资源树查询
export const GetResourceTree = _ => {
	return http.fetchGet(`/sysResources/tree`, true)
}