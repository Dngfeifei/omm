import http from './index'

export const getProfileList = (params = {}) => {
	return http.fetchGet(`/fileProfile/list`, params)
}

export const addProfile = (params = {}) => {
	return http.fetchPost(`/fileProfile/add`, params, true)
}

export const editProfile = (params = {}) => {
	return http.fetchPost(`/fileProfile/update`, params, true)
}

export const deleteProfile = (params = {}) => {
	return http.fetchGet(`/fileProfile/delete`, params)
}

