import http from './index'

//获取列表数据
export const getWorkList = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchGet('/sysResources/getWorkList', params)
}

//获取工单操作页面的操作权限
export const getOperation = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchGet('/sysResources/getOperation', params)
}

//获取流程图
export const getChart = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchGet('/sysResources/getChart', params)
}
