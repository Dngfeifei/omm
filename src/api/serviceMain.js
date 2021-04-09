/***
 * 服务需求表----主表接口
 * 
 */

import http from './index'


// 获取--基本信息----表工单号接口
export const serviceWorkOrder = (params = {}) => {
	return http.fetchGet(`/sqt/businessKey`, params)
}


// 服务计划表---主表数据查询接口
export const SqtBaseDetail = (id,params = {}) => {
	return http.fetchGet(`biSqtBase/detail/${id}`, params)
}

// 服务计划表主表数据提交接口
export const SqtBase = (params = {}) => {
	return http.fetchPost(`/biSqtBase/add`, params , true)
}

// 上传附件
export const SqtBaseupload = (params = {}) => {
	return http.fetchPost(`/biSqtBase/upload`, params,true)
}

// 服务计划表---附表数据查询接口
export const getAssistant = (params = {}) => {
	return http.fetchGet(`biSqtBase/getAssistant`, params)
}
// 服务计划表---附表数据提交接口
export const PostaddAssistant = (params = {}) => {
	return http.fetchPost(`biSqtBase/addAssistant`, params,true)
}