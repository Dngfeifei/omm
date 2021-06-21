/***********************         系统参数相关接口       ********************************/

import http from './index'

//  获取系统参数类型树
export const getCategoryTree = (params = {}) => {
    return http.fetchGet('/metaCategories/getTree', params)
}

// 新增参数类型
export const addTree = (params = {}) => {
    return http.fetchPost('/metaCategories/add', params,true)
}

// 编辑参数类型
export const updateTree = (params = {}) => {
    return http.fetchPost('/metaCategories/update', params,true)
}

// 删除参数类型
export const deleteTree = (params = {}) => {
    return http.fetchGet('/metaCategories/delete', params)
}

// 查询参数类型详情
export const getInfoTree = (params = {}) => {
    return http.fetchGet('/metaCategories/getInfo', params)
}


//  获取系统参数列表
export const getLists = (params = {}) => {
    return http.fetchGet('/metaTable/getList', params)
}

// 单个--新增系统参数
export const addTable = (params = {}) => {
    return http.fetchPost('/metaTable/add', params,true)
}

// 编辑系统参数
export const updateTable = (params = {}) => {
    return http.fetchPost('/metaTable/update', params,true)
}

// 单个--删除系统参数
export const deleteTable = (params = {}) => {
    return http.fetchGet('/metaTable/delete', params)
}
//获得字段明细
export const getColumnList = (params = {}) => {
    return http.fetchGet('/metaData/list', params)
}
//字段明细保存
export const saveColumnList = (params = {}) => {
    return http.fetchPost('/metaData/save', params, true)
}
