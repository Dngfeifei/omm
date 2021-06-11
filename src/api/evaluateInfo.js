//权限管理wangxinyue
import http from './index'



// 工程师自评技能报表（分页）
export const GetselectAssessReportList = (limit,offset,params={}) => {
	return http.fetchPost(`biStatisticalReport/selectAssessReportList?limit=${limit}&offset=${offset}`,params,true)
}

// 展示工程师自评技能报表
export const GetselectAssessProableReportList = (params={}) => {
	return http.fetchPost('biStatisticalReport/selectAssessProableReportList',params,true)
}