//权限管理wangxinyue
import http from './index'

//1查询模型列表树
export const GetsystemTree = () => {
	return http.fetchGet('bdpFunAuth/modelist')
}

// /2获取岗位组树状列表
export const GetgetTree = () => {
	return http.fetchGet('sysPositionsCategories/getTree')
}
// 3、查询岗位列表（分页）2021/5/19号
export const GetTreePaging = (params={}) => {
	return http.fetchGet('sysPositionsCategories/getPosition',params)
}
// 4、查询属性列表[模拟]metaCategoriesId
export const GetAttributeList = (params={}) => {
	params = Object.assign({}, params)
	return http.fetchGet('/bdpFunAuth/getFields',params)
}

// // 5、查询属性取值范围GET
export const GetFieldsRange = (params={}) => {
	return http.fetchGet('bdpFunAuth/getFieldsRange',params)
}

// //6、新增数据权限post 给他传过去
export const Addadd = (params = {}) => {
	return http.fetchPost('bdpFunAuth/add', params, true)
}


//7:查询数据权限列表（分页）2021521
export const GetList = (params={}) => {
	return http.fetchGet('bdpFunAuth/getList',params)
}


// 8、修改数据权限post  bdpFunAuth/update

export const Getupdate = (params={}) => {
	return http.fetchPost('bdpFunAuth/update',params,true)
}

//9、删除数据权限GET
export const GetDelete = (params={}) => {
	return http.fetchGet('bdpFunAuth/delete',params)
}