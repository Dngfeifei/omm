import http from './index'
/** 
 * 系统管理
 * 资源管理接口
 **/
// 资源树查询
export const GetResourceTree = _ => {
	return http.fetchGet(`/sysResources/tree`, true)
}
// 新增资源
export const AddResource = (params = {}) => {
	return http.fetchPost(`/sysResources`, params)
}
// 编辑资源
export const EditResource = (params = {}) => {
	return http.fetchPut(`/sysResources`, params)
}
// 删除资源
export const DelResource = (params = {}) => {
	return http.fetchGet(`/sysResources/delete`, params)
}
// 查询资源详情
export const GetResourceInfo = (params) => {
	return http.fetchGet(`/sysResources/${params}`)
}

