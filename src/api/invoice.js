import http from './index'

export const getinvoicelist = (params = {}) => {
	return http.fetchGet(`/invoice/list`, params)
}

export const importURL = http.tools.handleURL('/invoice/importInvoice')

export const getcontsalelist = (params = {}) => {
	return http.fetchGet(`/invoice/getContsaleList`, params)
}

export const getcontbuylist = (params = {}) => {
	return http.fetchGet(`/invoice/getContbuyList`, params)
}

export const getcontepiblist = (params = {}) => {
	return http.fetchGet(`/invoice/getContepibList`, params)
}
//保存关联 
export const savelink = (params = {}) => {
	return http.fetchPost(`/invoiceLink/saveLink`, params, true)
}
//获得关联关系
export const getlinklist = (params = {}) => {
	return http.fetchGet(`/invoiceLink/list`, params)
}
//获得商品明细
export const getinvoicedetails = (params = {}) => {
	return http.fetchGet(`/invoiceDetail/list`, params)
}
//查询发票
export const invoicelist = (params = {}) => {
	return http.fetchGet(`/invoice/invoiceList`, params)
}

//获得原件借用情况
export const getBorrowPaperList = (params = {}) => {
	return http.fetchGet(`/invoice/getBorrowPaperList`, params)
}
//归还纸质发票
export const returnPaper = (params = {}) => {
	return http.fetchGet(`/invoice/returnPaper`, params)
}
//批量归还
export const returnMutiPaper = (params = {}) => {
	return http.fetchGet(`/invoice/returnMutiPaper`, params)
}
