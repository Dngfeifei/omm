import http from './index'

// 获取岗位table数据
export const GetPostData = (params = {}) => {
	return http.fetchGet(`/sysPositions`, params)
}
// 新增岗位
export const AddPost = (params = {}) => {
	return http.fetchPost(`/sysPositions`, params)
}
// 修改岗位
export const EditPost = (params = {}) => {
	return http.fetchPut(`/sysPositions`, params)
}
// 删除岗位
export const DelPost = (params = {}) => {
	return http.fetchDelete(`/sysPositions`, params)
}



// 获取机构tree数据
export const GetOrgTree = () => {
	return http.fetchGet(`/organization/getTree`)
}
// 查询人员
export const GetPeople = (params = {}) => {
	return http.fetchGet(`/sysUser`, params)
}
// 关联人员
export const RelationPeople = () => {
	return http.fetchGet(`/securityRoleCategories/tree`)
}
// 取消关联人员
export const UnRelationPeople = () => {
	return http.fetchGet(`/securityRoleCategories/tree`)
}

// 获取角色组tree数据
export const GetRoleGroupTree = () => {
	return http.fetchGet(`/securityRoleCategories/tree`)
}
// 查询角色组内角色数据
export const GetRoleData = () => {
	return http.fetchGet(`/securityRoleCategories/tree`)
}
// 关联角色二
export const RelationRole = () => {
	return http.fetchGet(`/securityRoleCategories/tree`)
}
// 取消关联角色
export const UnRelationRole = () => {
	return http.fetchGet(`/securityRoleCategories/tree`)
}