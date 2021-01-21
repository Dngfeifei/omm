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
	return http.fetchGet(`/sysPositions/delete`, params)
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
export const RelationPeople = (params = {}) => {
	return http.fetchPost(`/user/joinPosition`, params)
}
// 取消关联人员
export const UnRelationPeople = (params = {}) => {
	return http.fetchPost(`/sysPositions/removeUsers`, params)
}
// 取消关联岗位
export const UnRelationPost = (params = {}) => {
	return http.fetchPost(`/user/removePosition`, params)
}


// 获取角色组tree数据
export const GetRoleGroup = () => {
	return http.fetchGet(`/securityRoleCategories/tree`)
}
// 查询角色组内角色数据
export const GetRoleData = (params = {}) => {
	return http.fetchGet(`/securityRoles`, params)
}
// 关联角色二
export const RelationRole = (params = {}) => {
	return http.fetchPost(`/sysPositions/joinRoles`, params)
}
// 取消关联角色
export const UnRelationRole = (params = {}) => {
	return http.fetchPost(`/sysPositions/removeRoles`, params)
}