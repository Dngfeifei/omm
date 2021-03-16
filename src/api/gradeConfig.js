import http from './index'

// 获取工程师自评配置日志
export const GetAssessLog = () => {
	return http.fetchGet(`/assessVersion/AssessLog`)
}
// 获取工程师自评配置数据
export const GetAssessConfig = () => {
	return http.fetchGet(`/assessConfig`)
}
// 提交工程师自评配置数据
export const PostAssessConfig = (params) => {
	return http.fetchPost(`/assessConfig`,params,true)
}
// 零食开启工程师自评功能
export const TemporaryOpen = (params) => {
	return http.fetchPost(`/assessConfig//temporaryOpen`,params,true)
}