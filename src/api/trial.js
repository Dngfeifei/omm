import http from './index'

export const gettriallist = (params = {}) => 
	http.fetchGet(`/trial/getTrialList`, params)

export const getTrialInfo = (params = {}) => 
	http.fetchGet(`/trial/getTrialInfo`, params)

export const minesave = (params = {}) => {
	return http.fetchPost(`/trial/save`, params, true)
}

export const getaccrual = (params = {}) => 
	http.fetchGet(`/trial/accrual`, params)
