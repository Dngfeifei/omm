import http from '/api'

export const getprojitemlist = (params = {}) =>
	http.fetchGet(`/projitem/list`, params)

export const getprojitemdetail = (params = {}) =>
	http.fetchGet(`/projitem/detail`, params)	

//获得当前用户可以申请的项目
export const selectProjItems = (params = {}) =>
	http.fetchGet(`/projitem/select`, params)

//同步
export const syncProjItem = (params = {}) =>
	http.fetchGet(`/projitem/syncProjItem`, params, 600000)

//获取立项上次同步时间
export const getNCSyncDate = (params = {}) =>
	http.fetchGet(`/projitem/getNCSyncDate`, params)

export const getProjListThird = (params = {}) =>
	http.fetchGet(`/projitem/getProjListThird`, params)	

export const selectAllItems = (params = {}) =>
	http.fetchGet(`/projitem/selectAll`, params)