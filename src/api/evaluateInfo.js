//权限管理wangxinyue
import http from './index'



// 工程师自评技能报表（分页）
export const GetselectAssessReportList = (limit, offset, params = {}) => {
	return http.fetchPost(`biStatisticalReport/selectAssessReportList?limit=${limit}&offset=${offset}`, params, true)
}

// 展示工程师自评技能报表
export const GetselectAssessProableReportList = (params = {}) => {
	return http.fetchPost('biStatisticalReport/selectAssessProableReportList', params, true)
}


// 202171基础数据
export const Getbasedata = () => {
	return http.fetchGet(`/basedata`)
}

//导出按钮接口
export const GetexportAssessReportList = () => {
	return http.fetchGet(`/biStatisticalReport/exportAssessReportList`)
}
//专业导出按钮
export const GetexportSearchAssessAndProableReport = (params = {}) => {
	return http.fetchPost('biStatisticalReport/exportSearchAssessAndProableReport', params, true)
}

