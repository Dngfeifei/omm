import http from './index'

export const login = (params = {}) => 
	http.fetchPost(`/auth`, params, true)

export const getaccountemail = (params = {}) => 
	http.fetchGet(`/auth/getAccountEmail`, params)

export const sendemail = (params = {}) => 
	http.fetchGet(`/auth/sendEmail`, params)