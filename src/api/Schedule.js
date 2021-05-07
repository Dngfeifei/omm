/*
 * @Author: mikey.wangxinyue
 * @Date: 2021-04-We 10:27:06 
 * @Last Modified time: 2021-04-We 10:27:06 
 */

import http from './index'


// 查询客户列表（分页)
export const GetbiSqtBase= (limit,offset,params = {}) => {
	return http.fetchPost(`/biSqtBase/list?limit=${limit}&offset=${offset}`, params,true)
}



// 字典项详情
export const GetDictInfo = (params = {}) => {
	return http.fetchGet(`/sysDictItems/getByCode`, params)
}


// 查询公司信息列表
export const GetCompanyList = (params = {}) => {
	return http.fetchGet('/biCompany/all', params)
}








