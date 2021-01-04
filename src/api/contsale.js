import http from '/api'

export const getcontsalelist = (params = {}) =>
	http.fetchGet(`/contsale/list`, params)

export const getcontsaleall = (params = {}) =>
	http.fetchGet(`/contsale/listAll`, params)
//同步
export const syncContsale = (params = {}) =>
	http.fetchGet(`/contsale/syncContsale`, params, 600000)

//获取案例上次同步时间
export const getConSyncDate = (params = {}) =>
	http.fetchGet(`/contsaleCity/getConSyncDate`, params)	

export const getcontsaledetail = (params = {}) =>
	http.fetchGet(`/contsale/detail`, params)	

export const exportEqs = (params = {}) =>
	http.fetchBlob(`/contsaleEq/exportEqs`, params)

export const exportConTemplate = (params = {}) =>
	http.fetchBlob(`/contsale/exportConTemplate`, params)
//导出案例列表
export const exportContsales = 	(params = {}) =>
	http.fetchBlob(`/contsale/exportContsales`, params)

export const editConsale = (params = {}) =>
	http.fetchPost(`/contsale/edit`, params, true)

export const changeIsEnabled = (params = {}) =>
	http.fetchGet(`/contsale/changeIsEnabled`, params)	

export const getContractOccupys = (params = {}) =>
	http.fetchGet(`/contsale/getContractOccupys`, params)

export const getcontpaperlist = (params = {}) =>
	http.fetchGet(`/contsale/getContPaperList`, params)

export const returnPaper = 	(params = {}) =>
	http.fetchGet(`/contsale/returnPaper`, params)

export const renewPaper =  (params = {}) =>
	http.fetchGet(`/contsale/renewPaper`, params)

export const addMachine = (params = {}) =>
	http.fetchPost(`/contsaleEq/addMachine`, params, true)

export const deleteMachine = (params = {}) =>
	http.fetchGet(`/contsaleEq/deleteMachine`, params)	
//导入设备
export const importURL = http.tools.handleURL('/contsaleEq/importEqs')
//导入案例部分字段
export const importConsaleURL = http.tools.handleURL('/contsale/importContsales')
//初始拜访，按客户名称查询
export const getContListFirst = (params = {}) =>
	http.fetchGet(`/contsale/getContListFirst`, params)
//投标规则设计	
export const getContListSecond = (params = {}) =>
	http.fetchGet(`/contsale/getContListSecond`, params)
//高级搜索
export const highSearch = (params = {}) =>
	http.fetchGet(`/contsale/highSearch`, params)
//获得需求列表
export const getContsaleRequires = (params = {}) =>
	http.fetchGet(`/contsaleRequire/list`, params)
//获得已选择案例
export const geSelectedContsale = (params = {}) =>
	http.fetchGet(`/contsale/geSelectedContsale`, params)

//获得案例下载列表--temp
export const getcontemp = (params = {}) =>
	http.fetchGet(`/contApply/ctempList`, params)	

