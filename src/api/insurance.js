import http from './index'
// 社保代理缴纳记录
export const getInsuranceList = (params = {}) => {
	return http.fetchGet(`/insurance/list`, params)
}
export const addInsurance = (params = {}) => {
	return http.fetchPost(`/insurance/add`, params, true)
}
export const deleteInsurance = (params = {}) => {
	return http.fetchGet(`/insurance/delete`, params)
}
// 社保缴纳名单
export const getInsuranceDetailList = (params = {}) => {
	return http.fetchGet(`/insuranceDetail/list`, params)
}
export const addInsuranceDetail = (params = {}) => {
	return http.fetchPost(`/insuranceDetail/add`, params, true)
}
export const deleteInsuranceDetail = (params = {}) => {
	return http.fetchGet(`/insuranceDetail/delete`, params)
}
// 社保代理协议
export const getInsuranceAgentList = (params = {}) => {
	return http.fetchGet(`/insuranceAgent/list`, params)
}
export const addInsuranceAgent = (params = {}) => {
	return http.fetchPost(`/insuranceAgent/add`, params, true)
}
export const deleteInsuranceAgent = (params = {}) => {
	return http.fetchGet(`/insuranceAgent/delete`, params)
}
//导入缴纳清单
export const importURL = http.tools.handleURL('/insuranceDetail/importDetails')
//导出缴纳清单模版
export const exportDetailsTemplate = (params = {}) =>
	http.fetchBlob(`/insuranceDetail/exportDetailsTemplate`, params)

export const listPerson = (params = {}) => {
	return http.fetchGet(`/insurance/listPerson`, params)
}
//多份资料打包下载资料（加水印） by city
export const downloadByCity = (params = {}) => {
	return http.fetchPost(`/insurance/downloadByCity`, params, true, 900000)
}
//多份资料打包下载资料（加水印） by person
export const downloadByPerson = (params = {}) => {
	return http.fetchPost(`/insurance/downloadByPerson`, params, true, 900000)
}