import http from './index'

//获取资产配置管理结构树数据
export const GetRoleTree = () => {
	return http.fetchGet(`/static/mock/assetsBaseInfor.json`)
}
//获取配置库基础数据树数据
export const GetBasicTree = () => {
	//return http.fetchGet(`/static/mock/assetsBaseInfor.json`)
	return http.fetchGet(`/basedata/tree`)
}
//获取表格数据
export const GetTable = (params = {}) => {
	return http.fetchGet(`/basedata/list`, params)
}
//新增
export const AddTable = (params = {}) => {
	return http.fetchPost(`/basedata/add`, params,true)
}
//编辑
export const EditTable = (params = {}) => {
	return http.fetchPost(`/basedata/update`, params,true)
}
//删除
export const DelTable = (params = {}) => {
	return http.fetchGet(`/basedata/deleteBacth`, params)
}


// 资源树查询
export const GetResourceTree = _ => {
	return http.fetchGet(`/sysResources/tree`, true)
}

//获取基础数据页面的下拉数据接口
export const getBaseData = (params = {}) => {
	return http.fetchGet(`/static/mock/assetsData.json`, true)
}
//基础数据->下拉列表->数据类别
export const getAllBaseDataTypes = (params = {}) => {
	return http.fetchGet(`/basedata/listAllBaseDataTypes`, true)
}