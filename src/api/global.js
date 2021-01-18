import http from './index'

//获取导航节点
export const getMenu = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	//模拟接口，后续开发谨记替换
	return http.fetchGet('./static/mock/getMenu_copy.json', params)
	//return http.fetchGet('/sysResources/tree', params)
}

export const comObj = {};
//测试
export const getPost = (params = {}) => {
	// params = Object.assign({sysid: 1}, params)
	let paramss = {resourceName:'xxxxxx'}
	//模拟接口，后续开发谨记替换
	return http.fetchPost(`${params.url}`, paramss)
	//return http.fetchGet('/sysResources/tree', paramss)
}