import http from './index'

// const REMOTE_URL = '/flow'
const REMOTE_URL = ''

/**
 * 流程应用---表达式设置
 * @author lxx
 */


//  查询表达式列表（分页）
export const BiConditionList = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/extension/condition/list`, params)


// 新增表达式信息
export const AddCondition = (params = {}) => {
	return http.fetchFormData(REMOTE_URL + `/extension/condition/save`, params)
}
// 修改表达式信息
export const EditCondition = (params = {}) => {
	return http.fetchFormData(REMOTE_URL + `/extension/condition/save`, params)
}
// 删除表达式信息
export const DelCondition = (params = {}) => {
	return http.fetchDelete(REMOTE_URL + `/extension/condition/delete?ids=`+params)
}
