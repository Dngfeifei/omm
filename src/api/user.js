import http from './index'
/** 
 * 系统管理
 * 人员管理接口
 **/
// 人员信息查询
export const PersonnelListQuery = (params = {}) => {
	return http.fetchPost(`/user/findByPage`, params)
}
// 新增人员信息
export const PersonnelAdd = (params = {}) => {
	return http.fetchPost(`/user/add`, params, true)
}
// 修改人员信息
export const PersonnelEdit = (params = {}) => {
	return http.fetchPost(`/user/update`, params, true)
}
// 禁用人员
export const PersonnelDisable = (params = {}) => {
	return http.fetchPost(`/user/disable`, params, true)
}
// 重置密码
export const ResetPassword = (params = {}) => {
	return http.fetchPost(`/user/resetPassword`, params, true)
}
//人员数据导出
export const ExportFile = (params = {}) => {
	return http.fetchBlob(`/user/userExport`, params)
}
//人员模板导出
export const ExportFileModel = (params = {}) => {
	return http.fetchBlobPost(`/user/userTemplateDownload`, params)
}

// 全量机构信息查询
export const mechanismListQuery = (params = {}) => {
	return http.fetchGet(`/organization/getTree`, params)
}
