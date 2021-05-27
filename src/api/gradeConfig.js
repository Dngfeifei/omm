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
// 临时开启工程师自评功能
export const TemporaryOpen = (params) => {
	return http.fetchPost(`/assessConfig//temporaryOpen`,params,true)
}
// 工程师全量计算开启
export const GetRecalculate = () => {
	return http.fetchGet(`/assessConfig/recalculate`)
}
// 工程师历史自评数据计算日志日志
export const GetRecalculateLog = () => {
	return http.fetchGet(`/assessConfig/recalculateLog`)
}