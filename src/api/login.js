import http from './index'


// 登录
export const login = (params = {}) => {
	return http.fetchPost(`/auth`, params, true)
}

// 获取验证码
export const getCode = (params = {}) => {
	return http.fetchGet(`/getCode`, params)
}

// 退出登录
export const logout = (params = {}) => {
	return http.fetchGet(`/logout`, params)
}
 

// 首次登录修改密码
export const changepass = (params = {}) => {
	return http.fetchGet(`/updatePass`, params)
}


// 重置密码（修改密码）----邮件发送验证码
export const sendEmail = (params = {}) => {
	return http.fetchGet(`/auth/sendEmail`, params)
}

//  重置密码（修改密码）
export const resetPasswords = (params = {}) => {
	return http.fetchPost(`/auth/resetPassword`, params, true)
}
