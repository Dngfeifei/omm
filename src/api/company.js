import http from './index'

export const listCompany = (params = {}) => {
	return http.fetchGet(`/company/tree`, params)
}

export const addCompany = (params = {}) => {
	return http.fetchPost(`/company/add`, params, true)
}

export const deleteCompany = (params = {}) => {
	return http.fetchGet(`/company/delete`, params)
}
