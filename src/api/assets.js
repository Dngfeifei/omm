import http from './index'

//获取资产配置管理结构树数据
export const GetRoleTree = () => {
	return http.fetchGet(`/static/mock/assetsBaseInfor.json`)
}
//获取配置库基础数据树数据
export const GetBasicTree = () => {
	return http.fetchGet(`/static/mock/assetsBaseInfor.json`)
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

//获取基础数据页面的下拉数据接口
export const getBaseData = (params = {}) => {
	return http.fetchGet(`/static/mock/assetsData.json`, true)
}
