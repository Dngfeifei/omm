import http from './index'

//获得证书-部门权限
export const listCertDept = (params = {}) => {
	return http.fetchGet(`/cert/listCertDept`, params)
}
//设置证书-部门权限
export const setDeptAuthority = (params = {}) => {
	return http.fetchGet(`/cert/setDeptAuthority`, params)
}
export const addCertColumn = (params = {}) => {
	return http.fetchPost(`/certForm/add`, params, true)
}

export const getCertColumnList = (params = {}) => {
	return http.fetchGet(`/certForm/list`, params)
}

export const deleteCertColumn = (params = {}) => {
	return http.fetchGet(`/certForm/delete`, params)
}

export const addCert = (params = {}) => {
	return http.fetchPost(`/cert/add`, params, true)
}

export const getCertList = (params = {}) => {
	return http.fetchGet(`/cert/list`, params)
}

//查询可申请的证书
export const getCertApplyList = (params = {}) => {
	return http.fetchGet(`/cert/applyList`, params)
}

export const deleteCert = (params = {}) => {
	return http.fetchGet(`/cert/delete`, params)
}

export const getCertColumns = (params = {}) => {
	return http.fetchGet(`/certForm/listByType`, params)
}

export const getCertPaperList = (params = {}) => {
	return http.fetchGet(`/cert/getCertPaperList`, params)
}

//获得证书占用情况
export const getCertOccupys = (params = {}) => {
	return http.fetchGet(`/cert/getCertOccupys`, params)	
}

export const getBorrowPaperList = (params = {}) => {
	return http.fetchGet(`/cert/getBorrowPaperList`, params)
}
//归还纸质证书
export const returnPaper = (params = {}) => {
	return http.fetchGet(`/cert/returnPaper`, params)
}
//批量归还
export const returnMutiPaper = (params = {}) => {
	return http.fetchGet(`/cert/returnMutiPaper`, params)
}
//续借纸质证书
export const renewPaper = (params = {}) => {
	return http.fetchGet(`/cert/renewPaper`, params)
}
//批量续借
export const renewMutiPaper = (params = {}) => {
	return http.fetchGet(`/cert/renewMutiPaper`, params)
}
//导出
export const exportCert = (params = {}) => {
	return http.fetchBlob(`/cert/exportCert`, params)
}
//导出-申请
export const exportCertApply = (params = {}) => {
	return http.fetchBlob(`/cert/exportCertApply`, params)
}
//导出资质证书原件
export const exportCertPaper = (params = {}) => {
	return http.fetchBlob(`/cert/exportCertPaper`, params)
}
//导入列表地址
export const importListURL = http.tools.handleURL('/cert/importListURL')