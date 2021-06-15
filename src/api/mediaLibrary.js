/***
 *  资料库--介质库管理接口文件
 * @auth yyp
 */
import http from './index'



// 获取当前用户币值数据
export const GetFilePonints = () => {
	return http.fetchGet(`/filePonints/getByUser`)
}

// 获取介质类别树
export const GetFileCategories = () => {
	return http.fetchGet(`/fileCategories/getTree`)
}

// 新增介质类别
export const AddTreeNode = (params = {}) => {
	return http.fetchPost(`/fileCategories`, params, true)
}
// 编辑介质类别
export const EditTreeNode = (params = {}) => {
	return http.fetchPut(`/fileCategories`, params, true)
}
// 删除介质类别
export const DelTreeNode = (params) => {
	return http.fetchDelete(`/fileCategories/${params}`)
}
// 介质库查询
export const GetFileLibrary = (limit, offset, params) => {
	// return http.fetchPost(`/fileLibrary/getList?limit=${params.limit}&offset=${params.offset}`, params, true)
	return http.fetchPost(`/fileLibrary/getList?limit=${limit}&offset=${offset}`, params, true)
}

// 获取介质级别数据
export const GetFileLevels = () => {
	return http.fetchGet(`fileLevel/list`)
}




// 加签验证接口
export const GetSignResult = (params = {}) => {
	return http.fetchGet(`fileLibrary/sign`, params)
}
// 文件上传接口
export const PostFileUpload = (params) => {
	return http.fetchPost(`fileLibrary/upload`, params, true)
}
// 文件发布接口
export const PostFilePublish = (params) => {
	return http.fetchPost(`fileLibrary/publish`, params, true)
}

// 上传审核/编辑接口
export const FileUpdateExamine = (params) => {
	return http.fetchPost(`fileLibrary/update`, params, true)
}

// 下载审核/同意驳回
export const FileDownloadExamine = (params) => {
	return http.fetchPut(`fileApply/review`, params)
}
// 点赞接口
export const GetFileLike = (params = {}) => {
	return http.fetchGet(`fileLike/add`, params)
}
// 收藏接口
export const GetFileCollect = (params = {}) => {
	return http.fetchGet(`fileCollect/add`, params)
}

// 申请下载
export const GetFileApply = (params = {}) => {
	return http.fetchGet(`fileApply/applyDownload`, params)
}
// 文件下载接口
export const PostFileDownload = (params = {}) => {
	return http.fetchBlobPost(`fileLibrary/download`, params)
}

// 文件删除
export const DeleteFile = (params) => {
	return http.fetchGet(`/fileLibrary/deleteInfo`, params)
}
// 文件批量删除
export const BatchDeleteFile = (params) => {
	return http.fetchGet(`/fileLibrary/deleteBacth`, params)
}
// // 查询工程师已提交自评数据
// export const GetAssessData = (params = {}) => {
// 	return http.fetchGet(`/assess`, params)
// }

// // 新增专业技能
// export const PostAssessProable = (params) => {
// 	return http.fetchPost(`/assessProable`, params, true)
// }

// // 删除专业技能
// export const DelAssessProable = (params) => {
// 	return http.fetchDelete(`/assessProable/${params}`)
// }

// // 提交工程师自评数据
// export const PostAssessData = (params = {}) => {
// 	return http.fetchPost(`/assess`, params, true)
// }
// // 提交工程师自评数据
// export const PostSaveData = (params = {}) => {
// 	return http.fetchPost(`/assess/save`, params, true)
// }

// // 查询部门领导
// export const GetLeader = (params = {}) => {
// 	return http.fetchGet(`/assess/getLeader`, params)
// }