import http from './index'

export const addDept = (params = {}) => {
	return http.fetchPost(`/dept/add`, params, true)
}

export const editDept = (params = {}) => {
	return http.fetchPost(`/dept/update`, params, true)
}

export const deleteDept = (params = {}) => {
	return http.fetchGet(`/dept/delete`, params)
}

