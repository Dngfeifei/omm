import http from './index'

// 字典数据
export const GetDictionary = (params = {}) => {
	return http.fetchGet(`/sysDicts`, params)
}
export const AddDictionary = (params = {}) => {
	return http.fetchPost(`/sysDicts`, params)
}
export const EditDictionary = (params = {}) => {
	return http.fetchPut(`/sysDicts`, params)
}
export const DelDictionary = (params = {}) => {
	return http.fetchGet(`/sysDicts/delete`, params)
}
// 字典项数据
export const GetDictItems = (params = {}) => {
	return http.fetchGet(`/basedata/getDictItem`, params)
}
export const AddDictItem = (params = {}) => {
	return http.fetchPost(`/basedata/add`, params,true)
}
export const EditDictItem = (params = {}) => {
	return http.fetchPost(`/basedata/update`, params,true)
}
export const DelDictItem = (params = {}) => {
	return http.fetchGet(`/basedata/delete`, params)
}

// 字典项详情(旧)
export const GetDictInfo = (params = {}) => {
	return http.fetchGet(`/sysDictItems/getByCode`, params)
}
// 字典项详情(修改后)
export const GetDictInfo2 = (params = {}) => {
	return http.fetchGet(`/basedata/getByCode`, params)
}