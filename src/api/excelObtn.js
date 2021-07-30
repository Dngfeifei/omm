// wxy
import http from './index'
// 请求导出表的所有字段
//请求导出表按钮 所有字段


// 202171项目信息数据导出
export const GetexportView = () => {
    return http.fetchGet(`/biProject/exportView`)
}

// 1用户选中的字段,
//请求导出表按钮，数据导出
export const Postexport = (params) => {
    return http.fetchPost(`/biProject/export`, params, true)
}


// 2.客户信息 2021722
// 2请求导出表的所有字段
export const GetbiCustomer = () => {
    return http.fetchGet(`/biCustomer/exportView`)
}

export const PostbiCustomer = (params) => {
    return http.fetchPost(`/biCustomer/export`, params, true)
}

// 3工程师信息
export const GetbiUserexportView = () => {
    return http.fetchGet(`/biUser/exportView`)
}
export const PostbiUserexport = (params) => {
    return http.fetchPost(`/biUser/export`, params, true)
}















