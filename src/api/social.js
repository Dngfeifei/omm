import http from '/api'

export const getsociallist = (params = {}) =>
	http.fetchGet(`/social/list`, params)

export const deletesocial = (params = {}) =>
	http.fetchGet(`/social/delete`, params)

export const addsocial = (params = {}) =>
	http.fetchPost(`/social/add`, params, true)

export const getsocialdetail = (params = {}) =>
	http.fetchGet(`/socialDetail/list`, params)

export const deletesocialdetail = (params = {}) =>
	http.fetchGet(`/socialDetail/delete`, params)

export const addsocialdetail = (params = {}) =>
	http.fetchPost(`/socialDetail/add`, params, true)

export const exportSocials = (params = {}) => {
	return http.fetchBlob(`/social/exportSocials`, params)
}

export const exportSocialDetail = (params = {}) => {
	return http.fetchBlob(`/socialDetail/exportSocialDetail`, params)
}

export const importURL = http.tools.handleURL('/social/importSocials')

export const syncSocialData = (params = {}) =>
	http.fetchGet(`/social/syncSocialData`, params)

