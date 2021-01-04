import http from './index'

export const getparam = (params = {}) => 
	http.fetchGet(`/param/list`, params)

export const deleteparam = (params = {}) => 
	http.fetchGet(`/param/delete`, params)

export const addparam = (params = {}) => 
	http.fetchPost(`/param/add`, params, true)	
