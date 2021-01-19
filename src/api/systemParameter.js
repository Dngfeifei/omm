/***********************         系统参数相关接口       ********************************/

import http from './index'

//  获取系统参数类型树
export const getSystemTree = (params = {}) => {
	return http.fetchGet('/paramCategories/getTree', params)
}

// 新增参数类型
export const addTree = (params = {}) => {
	return http.fetchPost('/paramCategories/add', params,true)
}

// 编辑参数类型
export const updateTree = (params = {}) => {
	return http.fetchPost('/paramCategories/update', params,true)
}

// 删除参数类型
export const deleteTree = (params = {}) => {
	return http.fetchGet('/paramCategories/delete', params)
}

// 查询参数类型详情
export const getInfoTree = (params = {}) => {
	return http.fetchGet('/paramCategories/getInfo', params)
}


//  获取系统参数列表
export const getLists = (params = {}) => {
	return http.fetchGet('/sysParam/getList', params)
}

// 单个--新增系统参数
export const addSysList = (params = {}) => {
	return http.fetchPost('/sysParam/add', params,true)
}

// 批量--新增系统参数
export const addBatchSysList = (params = {}) => {
	return http.fetchPost('/sysParam/addBatch', params,true)
}


// 编辑系统参数
export const updateSysList = (params = {}) => {
	return http.fetchPost('/sysParam/update', params,true)
}

// 单个--删除系统参数
export const deleteSysList = (params = {}) => {
	return http.fetchGet('/sysParam/delete', params)
}

// 批量--删除系统参数
export const deleteBatchSysList = (params = {}) => {
	return http.fetchGet('/sysParam/deleteBatch', params)
}


// 操作日志--模块

// 获取日志列表（分页）
export const getSysLog = (limit,offset,params = {}) => {
	return http.fetchPost(`/sysLog/getList?limit=${limit}&offset=${offset}`, params,true)
}

// 查询数据字典项
export const getByCode = (params = {}) => {
	return http.fetchGet('/sysDictItems/getByCode', params)
}