/***
 *  基础信息--客户信息管理
 * @auth jxl
*/
import http from './index'


// 查询客户列表（分页)
export const getBiCustomer = (limit,offset,params = {}) => {
	return http.fetchPost(`/biCustomer/list?limit=${limit}&offset=${offset}`, params, true)
}

// 数据字典--查询
/**
 * 客户级别  sysDictItems/getByCode?dictCode= customerLevel 
 * 服务类别  sysDictItems/getByCode?dictCode= serviceType
 * 项目状态  sysDictItems/getByCode?dictCode= projectStatus
*/
export const  customerLevel = (params = {}) => {
	return http.fetchGet('/sysDictItems/getByCode', params)
}

// 查询客户详情
export const biCustomerInfo = (id,params = {}) => {
	return http.fetchGet(`/biCustomer/detail/${id}`, params)
}

// 修改客户信息
export const biCustomerUpdate = (params = {}) => {
	return http.fetchPost(`/biCustomer/update`, params, true)
}

// 机房信息列表
export const biCustomerPcRoom = (params = {}) => {
	return http.fetchPost(`/biComproom/byCust`, params, true)
}


// 项目信息列表
export const biCustomerProject = (params = {}) => {
	return http.fetchPost(`/biProject/byCust`, params, true)
}

// 工程师列表信息
 
 export const biCustomerbiUser = (params = {}) => {
	return http.fetchPost(`/biUser/byCust`, params, true)
}