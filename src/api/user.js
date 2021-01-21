import http from './index'
/** 
 * 系统管理
 * 人员管理接口
 **/
// 人员信息查询
export const getUserList = (params = {}) => {
	return http.fetchGet(`/sysUser`, params)
}
// 新增人员信息
export const AddUser = (params = {}) => {
	return http.fetchPost(`/sysUser`, params)
}
// 修改人员信息
export const EditUser = (params = {}) => {
	return http.fetchPut(`/sysUser`, params)
}
// 禁用人员
export const DisableUser = (params = {}) => {
	return http.fetchPost(`/user/disable`, params,true)
}
// 重置密码
export const ResetPass = (params = {}) => {
	return http.fetchPost(`/user/resetPassword`, params)
}
//人员数据导出
export const ExportFile = (params = {}) => {
	console.log(params,"00")
	return http.fetchBlobPost(`/user/userExport`, params)
}
//人员模板导出
export const ExportFileModel = () => {
	return http.fetchBlob(`/user/userTemplateDownload`)
}
//人员数据导入
export const ImportFile = (params = {}) => {
	return http.fetchBlobPost(`user/userUpload`, params)
}
// 全量机构信息查询
export const GetOrgList = (params = {}) => {
	return http.fetchGet(`/organization/getTree`, params)
}
