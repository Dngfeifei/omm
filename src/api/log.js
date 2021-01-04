import http from './index'

export const getLogList = (params = {}) => {
	return http.fetchGet(`/log/list`, params)
}

export const clearLogs = (params = {}) => {
	return http.fetchGet(`/log/delLog`, params)
}