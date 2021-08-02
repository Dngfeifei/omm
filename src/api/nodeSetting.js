import http from './index'

// const REMOTE_URL = '/flow'
const REMOTE_URL = ''

/**
 * 表单扩展属性表
 * @author lxx
 */


//  查询流程监听列表（分页）
export const GetValueByKey = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/extension/nodeSetting/queryValueByKey`, params)

