/***********************         系统参数相关接口       ********************************/

import http from './index'

//  获取系统参数类型树
export const getReport = (params = {}) => {
	console.log(params,"paramsparams")
	return http.fetchGet('/biStatisticalReport', params)
}

//  获取工程师技能评价报告.xlsx
export const getAssessmentReport = () => {
	return http.fetchGet('/assess/assessLevelReport',{},180000)
}


//  获取工程师评定结果
export const getAssessLeaderReport = () => {
	return http.fetchGet('/assess/assessLeaderReport',{},180000)
}
