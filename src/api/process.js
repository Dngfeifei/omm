import http from './index'

export const getMineList = (params = {}) => {
	return http.fetchGet(`/process/getMineList`, params)
}

export const viewForm = (params = {}) => {
	return http.fetchGet(`/process/viewForm`, params)
}

export const getTodoList = (params = {}) => {
	return http.fetchGet(`/process/getTodoList`, params)
}

export const getDoneList = (params = {}) => {
	return http.fetchGet(`/process/getDoneList`, params)
}

export const applyPass = (params = {}) => {
	return http.fetchGet(`/process/pass`, params)
}

export const applyUnPass = (params = {}) => {
	return http.fetchGet(`/process/unPass`, params)
}

export const getProcessImg = (params = {}) => {
	return http.fetchBlob(`/process/processImg`, params)
}

export const cancelProcess = (params = {}) => {
	return http.fetchGet(`/process/cancelPass`, params)
}

export const assignTask = (params = {}) => {
	return http.fetchGet(`/process/delegateTask`, params)
}

export const assignOwner = (params = {}) => {
	return http.fetchGet(`/process/assignOwner`, params)
}
// 保存案例申请流程中录入信息
export const saveTaskProps = (params = {}) => {
	return http.fetchGet(`/process/saveTaskProps`, params)
}
// 取回
export const retrievePass = (params = {}) => {
	return http.fetchGet(`/process/retrievePass`, params)
}

export const downloadURL = http.tools.handleURL('/auth/downloadByProcessId')
