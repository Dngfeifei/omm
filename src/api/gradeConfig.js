import http from './index'

export const GetAssessLog = () => {
	return http.fetchGet(`/assessVersion/AssessLog`)
}

export const GetAssessConfig = () => {
	return http.fetchGet(`/assessConfig`)
}
export const PostAssessConfig = (params) => {
	return http.fetchPost(`/assessConfig`,params,true)
}
export const TemporaryOpen = (params) => {
	return http.fetchPost(`/temporaryOpen`,params,true)
}