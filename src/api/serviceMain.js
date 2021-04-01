/***
 * 服务需求表----主表接口
 * 
 */

import http from './index'


// 获取--基本信息----表工单号接口
export const serviceWorkOrder = (params = {}) => {
	return http.fetchGet(`/sqt/businessKey`, params)
}


// 服务计划表---查询接口
export const SqtBaseDetail = (id,params = {}) => {
	return http.fetchPost(`biSqtBase/detail/${id}`, params)
}

// 服务计划表提交接口
export const SqtBase = (params = {}) => {
	return http.fetchPost(`/biSqtBase/add`, params)
}

// 上传附件
export const SqtBaseupload = (params = {}) => {
	return http.fetchPost(`/biSqtBase/upload`, params)
}