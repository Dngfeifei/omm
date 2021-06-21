import http from './index'

// const REMOTE_URL = '/flow'
const REMOTE_URL = ''

/**
 * 流程应用---表达式设置
 * @author lxx
 */


//  查询流程按钮列表（分页）
export const BiButtonList = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/extension/button/list`, params)


// 新增流程按钮信息
export const AddButton = (params = {}) => {
	return http.fetchFormData(REMOTE_URL + `/extension/button/save`, params)
}
// 修改流程按钮信息
export const EditButton = (params = {}) => {
	return http.fetchFormData(REMOTE_URL + `/extension/button/save`, params)
}
// 删除流程按钮信息
export const DelButton = (params = {}) => {
	return http.fetchDelete(REMOTE_URL + `/extension/button/delete?ids=`+params)
}
