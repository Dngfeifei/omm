import http from './index'

// const REMOTE_URL = '/flow'
const REMOTE_URL = ''


/**
 * 流程应用---流程分类设置
 * @author lxx
 */


//  查询流程分类列表（分页）
export const BiActCategoryList = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/extension/actCategory/treeData`, params)


// 新增流程分类信息
export const AddActCategory = (params = {}) => {
	return http.fetchFormData(REMOTE_URL + `/extension/actCategory/save`, params)
}
// 修改流程分类信息
export const EditActCategory = (params = {}) => {
	return http.fetchFormData(REMOTE_URL + `/extension/actCategory/save`, params)
}
// 删除流程分类信息
export const DelActCategory = (params = {}) => {
	return http.fetchDelete(REMOTE_URL + `/extension/actCategory/delete?id=`+params)
}

// 获取流程分类信息
export const GetActCategoryList = (params = {}) => {
	return http.fetchGet(REMOTE_URL + `/extension/actCategory/treeData?extId=`+params)
}

