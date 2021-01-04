import http from './index'

export const listbranch = (params = {}) => {
	return http.fetchGet(`/branchMain/list`, params)
}

export const addbranch = (params = {}) => {
	return http.fetchPost(`/branchMain/add`, params, true)
}

export const deletebranch = (params = {}) => {
	return http.fetchGet(`/branchMain/delete`, params)
}

export const listbranchcont = (params = {}) => {
	return http.fetchGet(`/branchContract/list`, params)
}

export const addbranchcont = (params = {}) => {
	return http.fetchPost(`/branchContract/add`, params, true)
}

export const deletebranchcont = (params = {}) => {
	return http.fetchGet(`/branchContract/delete`, params)
}

export const listbranchpaper = (params = {}) => {
	return http.fetchGet(`/branchPaper/list`, params)
}
// 资料上传完成
export const branchFinish = (params = {}) => {
	return http.fetchGet(`/branchMain/finishUpload`, params)
}

export const liststore = (params = {}) => {
	return http.fetchGet(`/storeMember/list`, params)
}

// 资料上传完成
export const storeFinish = (params = {}) => {
	return http.fetchGet(`/storeMember/finishUpload`, params)
}

export const liststorepaper = (params = {}) => {
	return http.fetchGet(`/storePaper/list`, params)
}

export const deletestorepaper = (params = {}) => {
	return http.fetchGet(`/storePaper/delete`, params)
}

export const addstorepaper = (params = {}) => {
	return http.fetchPost(`/storePaper/add`, params, true)
}

export const liststorage = (params = {}) => {
	return http.fetchGet(`/storage/list`, params)
}

export const listmachine = (params = {}) => {
	return http.fetchGet(`/storeMachine/list`, params)
}
//导出分支机构信息
export const exportBranch = (params = {}) => {
	return http.fetchBlob(`/branchMain/export`, params)
}
//导出备件库信息
export const exportStore = (params = {}) => {
	return http.fetchBlob(`/storeMember/export`, params)
}
//获得分支结构需要打包信息
export const getBranchPics = (params = {}) => {
	return http.fetchGet(`/branchMain/getBranchPics`, params)
}
//获得备件库需要打包信息
export const getStorePics = (params = {}) => {
	return http.fetchGet(`/storeMember/getStorePics`, params)
}
//修改原件数量
export const changePaperNum = (params = {}) => {
	return http.fetchGet(`/branchPaper/edit`, params)
}
//选择租房合同
export const listcontract = (params = {}) => {
	return http.fetchGet(`/branchContract/select`, params)
}
//选择营业执照
export const listzzpaper = (params = {}) => {
	return http.fetchGet(`/branchPaper/select`, params)
}
//获得原件借用情况
export const getBorrowPaperList = (params = {}) => {
	return http.fetchGet(`/branchContract/getBorrowPaperList`, params)
}
//归还纸质证书
export const returnPaper = (params = {}) => {
	return http.fetchGet(`/branchContract/returnPaper`, params)
}
//批量归还
export const returnMutiPaper = (params = {}) => {
	return http.fetchGet(`/branchContract/returnMutiPaper`, params)
}
//续借纸质证书
export const renewPaper = (params = {}) => {
	return http.fetchGet(`/branchContract/renewPaper`, params)
}
//批量续借
export const renewMutiPaper = (params = {}) => {
	return http.fetchGet(`/branchContract/renewMutiPaper`, params)
}