import http from './index'

// 获取机构树
export const getTree = ( ) => http.fetchGet(`/organization/getTree`)
// 添加机构
export const saveJG = (params = {}) => http.fetchPost(`/organization/add`, params,true)
// 编辑机构
export const editJG = (params = {}) => http.fetchGet(`/organization/get`, params)
export const saveEditJG = (params = {}) => http.fetchPost('/organization/update',params,true);
// 删除机构
export const deleteJG = (params = {}) => http.fetchGet('/organization/delete',params);
// 查询人员信息
export const checkRY = (params = {}) => http.fetchGet('/sysUser', params);
// 关联机构人员
export const releGL = (params = {}) => http.fetchPost('/organization/bindUser',params,true);
// 解除关联
export const deleteGL = (params = {}) => http.fetchPost('/organization/unbindUser',params,true);
// 添加人员
export const addRY = (params = {}) => http.fetchPost('/rest/bsk/history/queryTxlogLikeHistory3',params);
// 获取部门领导
export const getLeader = (params = {}) => http.fetchGet('/organization/getLeader', params);