/***
 * 系统公告相关请求
 * @author yyp
 */
import http from './index'

export const GetSysNotice = (params = {}) => {
    return http.fetchPost(`/sysNotice/getList`, params)
}
export const AddSysNotice = (params = {}) => {
    return http.fetchPost(`/sysNotice`, params, true)
}
export const EditSysNotice = (params = {}) => {
    return http.fetchPut(`/sysNotice`, params, true)
}
export const DelSysNotice = (params = {}) => {
    return http.fetchDelete(`/sysNotice/${params}`)
}
//附件导入
export const ImportFile = (params = {}) => {
    return http.fetchBlobPost(`/sysNotice/upload`, params)
}

//获取文件服务器ip
export const GetFilesIp = () => {
    return http.fetchGet(`/sysParam/getByName`, {
        paramterName: "fileUri"
    })
}

//删除附件
export const DelNoticeFile = (params = "") => {
    return http.fetchDelete(`/sysNoticeFile/delete?${params}`, )
}