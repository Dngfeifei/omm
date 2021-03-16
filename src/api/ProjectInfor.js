import http from './index'

/**
 * 信息管理---项目信息管理
 * @author jxl
 */


//  查询项目列表（分页）
export const BiProjectList = (limit,offset,params = {}) => {
	return http.fetchPost(`/biProject/list?limit=${limit}&offset=${offset}`, params,true)
}


// 查询项目详情
export const BiProjectInfo = (id,params = {}) => {
	return http.fetchGet(`/biProject/detail/${id}`, params)
}

// 查询公司信息列表
export const companyList = (params = {}) => {
	return http.fetchGet('/biCompany/all', params)
}

// 服务区域列表
export const ProjectArea = (projectId,params = {}) => {
	return http.fetchGet(`/biProjectArea/getByProId/${projectId}`, params)
}

// 项目组成员列表
export const ProjectMember = (projectId,params = {}) => {
	return http.fetchGet(`/biProjectMember/getByProId/${projectId}`, params)
}

// 客户技术联系人列表
export const Contact = (projectId,params = {}) => {
	return http.fetchGet(`/biCustContact/getByProId/${projectId}`, params)
}

// 服务对象列表

export const ServiceObject = (projectId,params = {}) => {
	return http.fetchGet(`/biServiceObject/getByProId/${projectId}`, params)
}