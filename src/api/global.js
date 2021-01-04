import http from './index'

export const getMenu = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	return http.fetchGet(`/menu/menuTreeList`, params)
}

export const uploadPaper = http.tools.handleURL('/paper/upload')

export const uploadAttr = http.tools.handleURL('/paper/uploadAttr')

export const downloadPathURL = http.tools.handleURL('/auth/downloadByPath')

export const uploadProcessPaper = http.tools.handleURL('/paper/uploadProcessPaper')

export const deleteProcessPaper = (params = {}) => {
	return http.fetchGet(`/paper/deleteProcessPaper`, params)
}

export const getPaperList = (params = {}) => {
	return http.fetchGet(`/paper/list`, params)
}

export const deletePaper = (params = {}) => {
	return http.fetchGet(`/paper/delete`, params)
}
//打包下载资料
export const downloadZip = (params = {}) => {
	return http.fetchBlob(`/paper/downloadZip`, params)
}
//打包下载资料（加水印）
export const downloadMarkZip = (params = {}) => {
	return http.fetchBlob(`/paper/downloadMarkZip`, params)
}
//多份资料打包下载资料（加水印）
export const downloadMutiMarkZip = (params = {}) => {
	return http.fetchPost(`/paper/downloadMutiMarkZip`, params, true, 600000)
}
export const downloadAttr = (params = {}) => {
	return http.fetchBlob(`/paper/downloadAttr`, params)
}
//流程审批通过后下载
export const downloadByProcessId = (params = {}) => {
	return http.fetchBlob(`/paper/downloadByProcessId`, params)
}
//流程审批后下载列表
export const downloadExcelByProcessId = (params = {}) => {
	return http.fetchBlob(`/paper/downloadExcelByProcessId`, params)
}
//获得系统参数设置
export const getParam = (params = {}) => {
	return http.fetchGet(`/param/getParam`, params)
}
//获得用户权限
export const getPermission = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	return http.fetchGet(`/mgr/getPermission`, params)
}
//获得用户角色
export const getThisrole = (params = {}) => {
	params = Object.assign({sysid: 1}, params)
	return http.fetchGet(`/mgr/getRoles`, params)
}
//获得待办数量
export const getTodoCount = (params = {}) => {
	return http.fetchGet(`/process/getTodoCount`, params)
}

