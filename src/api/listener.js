import http from './index'

// const REMOTE_URL = '/flow'
const REMOTE_URL = ''

/**
 * 流程应用---监听设置
 * @author lxx
 */


//  查询流程监听列表（分页）
export const BiListenerList = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/extension/listener/list`, params)


// 新增流程监听信息
export const AddListener = (params = {}) => {
	return http.fetchFormData(REMOTE_URL + `/extension/listener/save`, params)
}
// 修改流程监听信息
export const EditListener = (params = {}) => {
	return http.fetchFormData(REMOTE_URL + `/extension/listener/save`, params)
}
// 删除流程监听信息
export const DelListener = (params = {}) => {
	return http.fetchDelete(REMOTE_URL + `/extension/listener/delete?ids=`+params)
}
