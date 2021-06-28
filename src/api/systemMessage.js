import http from './index'

//获取消息通知列表数据
export const getNoticeTable = (params = {}) => {
	return http.fetchGet(`/sysMessage/list`,params);
}


//读取消息接口
export const getDoRead = (params = {}) => {
	return http.fetchGet(`/sysMessage/doRead`,params)
}

//查询未读消息接口
export const getUnreadNum = () => {
	return http.fetchGet(`/sysMessage/noSend`)
}

//删除消息接口
export const getDelete = (params = {}) => {
	return http.fetchGet(`/sysMessage/delete`,params)
}

//消息发送接口
export const addMessage = (params = {}) => {
	return http.fetchPost(`/sysMessage/add`, params,true)
}