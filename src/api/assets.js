import http from './index'

//获取资产配置管理结构树数据
export const GetAllocationTree = (params = {}) => {
	return http.fetchGet(`/basedata/tree`,params);
	//return http.fetchGet(`/static/mock/assetsBaseInfor.json`)type=configuration
}
//扩展字段获取
export const getConfigMeta = (params = {}) => {
	// return http.fetchGet(`/basedataMeta/getMeta`,params)
	return http.fetchGet(`/biConfigMeta/getMeta`,params)
}
//扩展字段获取
export const getBrand = (params = {}) => {
	return http.fetchGet(`/basedata/getBrand`,params)
}
//获取资产配置管理-所有下拉框数据
export const getBaseData = (params = {}) => {
	return http.fetchGet(`/basedata/getByBasedataType`,params)
}
//获取资产配置管理-风险等级数据
export const getInfo = (params = {}) => {
	return http.fetchGet(`/basedata/getInfo`,params)
}

//获取资产配置管理-区域下拉列表
export const GetAllocationArea = (projectId="") => {
	return http.fetchGet(`/biProjectArea/getByProId/${projectId}`)
}
//获取资产配置管理-客户联系人下拉列表
export const GetAllocationCustomer = (areaId="") => {
	return http.fetchGet(`/biCustContact/getArtContact/${areaId}`)
}
//获取资产配置管理-机房地址列表
export const GetAddress = (areaId="") => {
	return http.fetchGet(`/biComproom/byArea/${areaId}`)
}
//获取资产库配置管理表格数据
export const GetAllocationTable = (params = {},limit,offset) => {
	return http.fetchPost(`/biConfigurations/list?limit=${limit}&offset=${offset}`, params,true)
}
//资产库配置管理新增
export const AddAllocationTable = (params = {}) => {
	return http.fetchPost(`/biConfigurations/add`, params,true)
}
//资产库配置管理编辑
export const EditAllocationTable = (params = {}) => {
	return http.fetchPost(`/biConfiguration/update`, params,true)
}
//资产库配置管理删除
export const DelAllocationTable = (params = {}) => {
	return http.fetchGet(`/biConfigurations/delete`, params)
}
//获取部件列表接口
export const getParts = (params = {}) => {
	return http.fetchGet(`/basedata/getAllPartInfo`, params)
	//return http.fetchGet(`/static/mock/searchData.json`, params)
}
//获取风险信息列表接口
export const getRiskList = (params = {}) => {
	return http.fetchGet(`/basedata/getRiskConfig`, params)
	//return http.fetchGet(`/static/mock/searchData.json`, params)
}
//配置管理-查询详情数据接口
export const getDetail = (id) => {
	return http.fetchGet(`biConfigurations/detail/${id}`)
	//return http.fetchGet(`/static/mock/searchData.json`, params)
}




//获取配置库基础数据等树数据
export const GetBasicTree = (params = {}) => {
	return http.fetchGet(`/basedata/tree`,params)//?type=basedata
}
//新增时获取配置库基础数据等数据类别
export const getChildType = (params = {}) => {
	return http.fetchGet(`/basedata/getChildType`,params)//?type=basedata
}
//扩展字段获取
export const getMeta = (params = {}) => {
	return http.fetchGet(`/basedataMeta/getMeta`,params)//?type=basedata
}
//基础数据、服务目录、风险排查->新增的时候，预先获取子节点编码
export const generateChildCode = (params = {}) => {
	return http.fetchGet(`/basedata/generateChildCode`,params)//?type=basedata
}

//获取下拉数据
export const getByCode = (params = {}) => {
	return http.fetchGet(`/basedata/getByCode`,params)//?type=basedata
}

//获取配置库基础数据表格数据
export const GetTable = (params = {}) => {
	return http.fetchGet(`/basedata/queryBasedataList`, params)
}
//获取配置库基础数据表格数据-配置管理 硬件服务 软件服务使用
export const GetTablebasic = (params = {}) => {
	return http.fetchGet(`/biConfiguration/list`, params)
}
//配置库基础数据新增
export const AddTable = (params = {}) => {
	return http.fetchPost(`/basedata/add`, params,true)
}
//配置库基础数据编辑
export const EditTable = (params = {}) => {
	return http.fetchPost(`/basedata/update`, params,true)
}
//配置库基础数据删除
export const DelTable = (params = {}) => {
	return http.fetchGet(`/basedata/deleteBacth`, params)
}

//基础数据->下拉列表->数据类别
export const getAllBaseDataTypes = (params = {}) => {
	return http.fetchGet(`/basedata/listAllBaseDataTypes`)
}
//联想输入数据查询-基础数据
export const getBasicSearchData = (params = {}) => {
	return http.fetchGet(`/basedata/listKeywords`, params)
	//return http.fetchGet(`/static/mock/searchData.json`, params)
}