import http from './index'

// 获取工程师自评和专业能力下拉框基础数据
export const GetBaseData = () => {
	return http.fetchGet(`/basedata`)
}

// 查询工程师已提交自评数据
export const GetAssessData = (params = {}) => {
	return http.fetchGet(`/assess`, params)
}

// 新增专业技能
export const PostAssessProable = (params) => {
	return http.fetchPost(`/assessProable`, params, true)
}

// 删除专业技能
export const DelAssessProable = (params) => {
	return http.fetchDelete(`/assessProable/${params}`)
}

// 提交工程师自评数据
export const PostAssessData = (params = {}) => {
	return http.fetchPost(`/assess`, params, true)
}
// 提交工程师自评数据
export const PostSaveData = (params = {}) => {
	return http.fetchPost(`/assess/save`, params, true)
}

// 查询部门领导
export const GetLeader = (params = {}) => {
	return http.fetchGet(`/assess/getLeader`, params)
}