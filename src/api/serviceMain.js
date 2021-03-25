/***
 * 服务需求表----主表接口
 * 
 */

import http from './index'


// 获取--基本信息----表工单号接口
export const serviceWorkOrder = (params = {}) => {
	return http.fetchGet(`/sql/businessKey`, params)
}