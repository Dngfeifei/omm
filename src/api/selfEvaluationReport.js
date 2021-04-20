/***********************         系统参数相关接口       ********************************/

import http from './index'

//  获取系统参数类型树
export const getReport = (params = {}) => {
	console.log(params,"paramsparams")
	return http.fetchGet('/biStatisticalReport', params)
}