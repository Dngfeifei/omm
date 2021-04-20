import http from './index'

//获取列表数据
// 获取日志列表（分页）
export const getWorkList = (limit,offset,params = {}) => {
	params = Object.assign({}, params)
	return http.fetchPost(`/process/list?limit=${limit}&offset=${offset}`, params,true)
}

//获取微观风险显示数据
export const getMicroRisk = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchGet('/microRisk/getInfo', params)
}

//获取微观风险汇总数据
export const getMicroRiskSum = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchGet('/microRiskSum/getInfo', params)
}