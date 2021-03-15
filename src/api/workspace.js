import http from './index'

//获取列表数据
// 获取日志列表（分页）
export const getWorkList = (limit,offset,params = {}) => {
	params = Object.assign({}, params)
	return http.fetchPost(`/process/list?limit=${limit}&offset=${offset}`, params,true)
}

//获取工单操作页面的操作权限
export const getOperation = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchGet('/process/viewForm', params)
}

//获取工单类型
export const getTicketType = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchGet('/process/listTicketTypes', params)
}

//获取工单状态
export const getStatus = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchGet('/process/listTicketStatus', params)
}

//获取历史任务节点
export const getBackTask = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchGet('/process/listBackTask', params)
}
// 提交流程单1
export const getSubmit = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchPost(`/process/commit`, params,true)
}
// 提交流程单2
export const getSubmit2 = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchPost(`/process/setNextTaskAssignee`, params,true)
}

// 驳回流程单
export const getUnpass = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchPost(`/process/unpass`, params,true)
}

// 加签
export const getEndorse = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchPost(`/process/endorse`, params,true)
}
// 转办
export const getTransfer = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchPost(`/process/transfer`, params,true)
}
//获取流程图
export const getProcessImg = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchGet(`/process/processImg`, params)
}
// 删除附件
export const getDeleteAttachment = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchGet(`/process/deleteAttachment`, params)
}
//获取流程图
export const getRetrieve = (params = {}) => {
	params = Object.assign({}, params)
	return http.fetchGet(`/process/retrieve`, params)
}