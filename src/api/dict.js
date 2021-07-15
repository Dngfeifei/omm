import http from './index'

// const REMOTE_URL = 'http://152.136.121.201:8080/jeeplus-vue';
const REMOTE_URL = '';

export const getDictTypeList = (params = {}) => {
	return http.fetchGet(REMOTE_URL + `/sys/dict/type/list`, params)
}

export const getDictMap = (params = {}) => {
	return http.fetchGet(REMOTE_URL + `/sys/dict/getDictMap`, params)
}

export const getDictList = (params = {}) => {
	return http.fetchPost(`/dict/list`, params)
}

export const addDict = (params = {}) => {
	return http.fetchPost(`/dict/add`, params)
}

export const editDict = (params = {}) => {
	return http.fetchPost(`/dict/update`, params)
}

export const deleteDict = (params = {}) => {
	return http.fetchGet(`/dict/delete`, params)
}


export const getDictDataList = (params = {}) => {
	return http.fetchPost(`/dictData/list`, params)
}

export const addDictData = (params = {}) => {
	return http.fetchPost(`/dictData/add`, params)
}

export const editDictData = (params = {}) => {
	return http.fetchPost(`/dictData/update`, params)
}

export const deleteDictData = (params = {}) => {
	return http.fetchGet(`/dictData/delete`, params)
}

export const getDictSelect = (params = {}) => {
	return http.fetchGet(`/dictData/getDictSelect`, params)
}

export const getDictSelectMuti = (params = {}) => {
	return http.fetchGet(`/dictData/getDictSelectMuti`, params)
}

export const exportDict = (params = {}) => {
	return http.fetchBlob(`/dictData/exportDict`, params)
}

export const importURL = http.tools.handleURL('/dictData/importDict')

export const getCompanys = (params = {}) => {
	return http.fetchGet(`/company/tree`, params)
}
