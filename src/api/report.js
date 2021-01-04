import http from './index'

export const getReportList = (params = {}) => {
	return http.fetchGet(`/report/list`, params)
}

export const getReportListAll = (params = {}) => {
	return http.fetchGet(`/report/listAll`, params)
}

export const addReport = (params = {}) => {
	return http.fetchPost(`/report/add`, params, true)
}

export const editReport = (params = {}) => {
	return http.fetchPost(`/report/update`, params, true)
}

export const deleteReport = (params = {}) => {
	return http.fetchGet(`/report/delete`, params)
}

export const getReportData = (params = {}) => {
	return http.fetchGet(`/report/viewData`, params)
}

export const viewChart = (params = {}) => {
	return http.fetchGet(`/report/viewChart`, params)
}

export const getReportSearch = (params = {}) => {
	return http.fetchGet(`/report/getReportSearch`, params)
}

export const getReportHref = (params = {}) => {
	return http.fetchGet(`/report/getReportHref`, params)
}

export const getDataSources = (params = {}) => {
	return http.fetchGet(`/report/getMutiDataSources`, params)
}

export const getDetail= (params = {}) => {
	return http.fetchGet(`/report/detail`, params)
}

export const exportReport = (params = {}) => {
	return http.fetchBlob(`/report/exportExcel`, params, 600000)
}

export const getGroupReport = (params = {}) => {
	return http.fetchGet(`/report/getGroupReport`, params)
}
