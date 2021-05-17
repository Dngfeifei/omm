import http from './index'

//查询模型列表树
export const GetsystemTree = () => {
	return http.fetchGet(`bdpFunAuth/modelist`)
}
//获取岗位组树状列表
export const GetgetTree = () => {
	return http.fetchGet(`sysPositionsCategories/getTree`)
}
//获取岗位组树状列表
export const GetTreelist = () => {
	return http.fetchGet(`sysPositionsCategories/getPosition`)
}














