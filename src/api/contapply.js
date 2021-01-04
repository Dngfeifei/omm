import http from './index'

export const submitApply = (params = {}) => {
	return http.fetchPost(`/contApply/add`, params, true)
}

export const renewCert = (params = {}) => {
	return http.fetchGet(`/contApply/renewCert`, params)
}

export const returnBackCert = (params = {}) => {
	return http.fetchGet(`/contApply/returnBackCert`, params)
}

export const saveContDetail = (params = {}) => {
	return http.fetchPost(`/contApply/saveContDetail`, params, true)
}

export const saveApply = (params = {}) => {
	return http.fetchPost(`/contApply/save`, params, true)
}

export const getdetails = (params = {}) => {
	return http.fetchGet(`/contApply/ctempDetailList`, params)
}
//财务审计报告申请提交
export const submitFinanceApply = (params = {}) => {
	return http.fetchPost(`/contApply/addFinance`, params, true)
}
//分支机构营业执照和租房合同原件申请
export const submitBranchApply = (params = {}) => {
	return http.fetchPost(`/contApply/addBranch`, params, true)
}
//备件清单申请
export const submitStorageApply = (params = {}) => {
	return http.fetchPost(`/contApply/addStorage`, params, true)
}
//人员信息申请
export const submitStaffApply = (params = {}) => {
	return http.fetchPost(`/contApply/addStaffApply`, params, true)
}
//保存人员信息明细
// export const saveStaffDetail = (params = {}) => {
// 	return http.fetchPost(`/contApply/saveStaffDetail`, params, true)
// }
//保存简历模版信息
export const saveResumneId = (params = {}) => {
	return http.fetchGet(`/contApply/saveResumneId`, params)
}
//获得申请记录
export const getApplies = (params = {}) => {
	return http.fetchGet(`/contApply/getApplies`, params)
}
export const downloadURL = http.tools.handleURL('/auth/downloadByContApplyId')
//保存选择的人员信息明细
export const getAndSaveDetailRemote = (params = {}) => {
	return http.fetchPost(`/contApply/getAndSaveDetailRemote`, params, true)
}
//删除选择的人员明细
export const deleteDetailRemote = (params = {}) => {
	return http.fetchGet(`/contApply/deleteDetailRemote`, params)
}
//修改调用原件状态
export const changePaperState = (params = {}) => {
	return http.fetchGet(`/contApply/changePaperState`, params)
}
//获得我已完成的审批单
export const getMyContApply = (params = {}) => {
	return http.fetchGet(`/contApply/getMyContApply`, params)
}