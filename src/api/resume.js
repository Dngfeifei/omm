import http from './index'

export const getResumeTemplateList = (params = {}) => {
	return http.fetchPost(`/resumeTemplate/list`, params)
}

export const addResumeTemplate = (params = {}) => {
	return http.fetchPost(`/resumeTemplate/add`, params, true)
}

export const editResumeTemplate = (params = {}) => {
	return http.fetchPost(`/resumeTemplate/update`, params, true)
}

export const deleteResumeTemplate = (params = {}) => {
	return http.fetchGet(`/resumeTemplate/delete`, params)
}

export const uploadTemplate = http.tools.handleURL('/resumeTemplate/upload')

export const downloadFile = (params = {}) => {
	return http.fetchBlob(`/resumeTemplate/downloadFile`, params)
}

export const downloadTempFile = (params = {}) => {
	return http.fetchBlob(`/resumeTemplate/downloadTempFile`, params)
}

export const selectResumes = (params = {}) => {
	return http.fetchGet(`/resumeTemplate/select`, params)	
}
// export const getDictDataList = (params = {}) => {
// 	return http.fetchPost(`/dictData/list`, params)
// }

// export const addDictData = (params = {}) => {
// 	return http.fetchPost(`/dictData/add`, params, true)
// }

// export const editDictData = (params = {}) => {
// 	return http.fetchPost(`/dictData/update`, params, true)
// }

// export const deleteDictData = (params = {}) => {
// 	return http.fetchGet(`/dictData/delete`, params)
// }