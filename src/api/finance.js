import http from './index'

export const listpaper = (params = {}) => {
	return http.fetchGet(`/financeMain/list`, params)
}

export const deletepaper = (params = {}) => {
	return http.fetchGet(`/financeMain/delete`, params)
}

export const addpaper = (params = {}) => {
	return http.fetchPost(`/financeMain/add`, params, true)
}

export const saveNData = (params = {}) => {
	return http.fetchPost(`/financeMain/saveNData`, params, true)
}

export const getNData = (params = {}) => {
	return http.fetchGet(`/financeMain/getNData`, params)
}

export const listfinancebank = (params = {}) => {
	return http.fetchGet(`/financeBank/list`, params)
}

export const deletefinancebank = (params = {}) => {
	return http.fetchGet(`/financeBank/delete`, params)
}

export const addfinancebank = (params = {}) => {
	return http.fetchPost(`/financeBank/add`, params, true)
}

export const listfinanceinvoice = (params = {}) => {
	return http.fetchGet(`/financeInvoice/list`, params)
}

export const deletefinanceinvoice = (params = {}) => {
	return http.fetchGet(`/financeInvoice/delete`, params)
}

export const addfinanceinvoice = (params = {}) => {
	return http.fetchPost(`/financeInvoice/add`, params, true)
}
//导出银行收款账户
export const exportBank = (params = {}) => {
	return http.fetchBlob(`/financeBank/export`, params)
}
//导出发票信息
export const exportInvoice = (params = {}) => {
	return http.fetchBlob(`/financeInvoice/export`, params)
}
//导出财务信息
export const exportFinanceState = (params = {}) => {
	return http.fetchBlob(`/financeMain/exportFinanceState`, params)
}
//获得原件借用情况
export const getBorrowPaperList = (params = {}) => {
	return http.fetchGet(`/financeMain/getBorrowPaperList`, params)
}
//归还纸质证书
export const returnPaper = (params = {}) => {
	return http.fetchGet(`/financeMain/returnPaper`, params)
}
//批量归还
export const returnMutiPaper = (params = {}) => {
	return http.fetchGet(`/financeMain/returnMutiPaper`, params)
}
//续借纸质证书
export const renewPaper = (params = {}) => {
	return http.fetchGet(`/financeMain/renewPaper`, params)
}
//批量续借
export const renewMutiPaper = (params = {}) => {
	return http.fetchGet(`/financeMain/renewMutiPaper`, params)
}
