/***
 *  基础信息--客户信息管理
 * @auth jxl
*/
import http from './index'


// 查询客户列表（分页)
export const getBiCustomer = (limit,offset,params = {}) => {
	return http.fetchPost(`/biCustomer/list?limit=${limit}&offset=${offset}`, params, true)
}

// 查询客户级别---> sysDictItems/getByCode?dictCode= customerLevel
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