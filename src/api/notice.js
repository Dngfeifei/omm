import http from './index'

export const getnotices = (params = {}) => 
	http.fetchGet(`/notice/list`, params)

export const deletenotice = (params = {}) => 
	http.fetchGet(`/notice/delete`, params)

export const addnotice = (params = {}) => 
	http.fetchPost(`/notice/add`, params, true)	

export const getmessages = (params = {}) => 
	http.fetchGet(`/message/list`, params)

export const getUnviewMessage = (params = {}) => 
	http.fetchGet(`/message/getUnViewed`, params)