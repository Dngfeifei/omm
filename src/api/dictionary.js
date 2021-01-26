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
export const DelDictionary= (params = {}) => {
	return http.fetchGet(`/sysDicts/delete`, params)
}
// 字典项数据
export const GetDictItems = (params = {}) => {
	return http.fetchGet(`/sysDictItems`, params)
}
export const AddDictItem = (params = {}) => {
	return http.fetchPost(`/sysDictItems`, params)
}
export const EditDictItem = (params = {}) => {
	return http.fetchPut(`/sysDictItems`, params)
}
export const DelDictItem = (params = {}) => {
	return http.fetchGet(`/sysDictItems/delete`, params)
}

// 字典项详情
export const GetDictInfo = (params = {}) => {
	return http.fetchGet(`/sysDictItems/getByCode`, params)
}


