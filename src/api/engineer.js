/**
 * 工程师管理模块
 * @author jxl
 * 
 */
import http from './index'

// 查询工程师列表（分页)
export const getBiUser = (limit,offset,params = {}) => {
	return http.fetchPost(`/biUser/list?limit=${limit}&offset=${offset}`, params,true)
}

// 查询工程师详情
export const biUserInfo = (id,params = {}) => {
	return http.fetchGet(`/biUser/detail/${id}`, params)
}

// 获取 文化程度
export const  educationalLevel = (params = {}) => {
	return http.fetchGet('/sysDictItems/getByCode', params)
}


// 获取 证书信息
export const  getCertificate = (userId,params = {}) => {
	return http.fetchGet(`/biCert/byUser/${userId}`, params)
}

// 工作经验和专业能力接口
export const  getSelectByUserId = (params = {}) => {
	return http.fetchGet(`/assess/selectByUserId`, params)
}