import http from './index'

// const REMOTE_URL = '/flow'
const REMOTE_URL = ''
/**
 * 流程应用---流程设计
 * @author lxx
 */


// 查询流程列表（分页）
export const BiDesignList = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/flowable/model/list`, params)

// 部署流程信息
export const DeployFlow = (params = {}) =>
	http.fetchFormData(REMOTE_URL + `/flowable/model/deploy`, params)

// 复制流程信息
export const CopyFlow = (params = {}) =>
	http.fetchFormData(REMOTE_URL + `/flowable/model/copy`, params)

// 激活流程
export const ActiveFlow = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/flowable/process/update/active`, params)

// 删除流程信息
export const DelFlow = (params = {}) => {
	return http.fetchDelete(REMOTE_URL + `/flowable/model/delete?ids=`+params)
}

//获取流程定义信息-xml
export const GetBpmnXml = (params = {}) => {
	return http.fetchGetXml(REMOTE_URL + `/flowable/model/getBpmnXml`,params)
}


//更新流程分类
export const UpdateFlowCategory = (params = {}) => {
	return http.fetchPost(REMOTE_URL + `/flowable/model/updateCategory?id=`+params.id+`&category=`+params.category)
}


// 保存并且发布
export const SaveAndPush = (params = {}) =>{
	http.fetchFormData(REMOTE_URL + `/extension/formDefinitionJson/save`, params)
}


// ---------------------------------用户，岗位，角色相关接口---------------------------------
// 根据用户id获取用户信息
export const FLowQueryByUserId = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/sys/user/queryById`, params)

// 根据角色id获取角色信息
export const FLowQueryByRoleId = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/sys/role/queryById`, params)


// 根据id获取岗位信息
export const FLowQueryByPostId = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/sys/post/queryById`, params)



// 根据id获取部门信息
export const FLowQueryByDepartId = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/sys/office/queryById`, params)


// 根据用户列表
export const FLowUserList = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/sys/user/list`, params)

//获取部门列表
export const FLowDepartList = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/sys/office/treeData`, params)


//获取岗位列表
export const FLowPostList = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/sys/post/list`, params)

//获取角色列表
export const FLowRoleList = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/sys/role/list`, params)


//获取流程完整信息
export const FLowRestModel = (param = {}) =>
	http.fetchGet(REMOTE_URL + `/app/rest/models/`+param+`/editor/json`)

//保存模型
export const FlowSaveModel = (modelId,params = {}) => {
	return http.fetchPost(REMOTE_URL + `/flowable/model/saveModel/`+modelId, params)
}

//处理任务信息
export const FlowTaskDefExtension = (params = {}) => {
	return http.fetchPost(REMOTE_URL + `/extension/taskDefExtension/save`, params,true)
}

//处理按钮信息
export const FlowNodeSetting = (params = {}) => {
	return http.fetchPost(REMOTE_URL + `/extension/nodeSetting/save`, params,true)
}

//部署流程
export const FlowDeployModel = (params = {}) => {
	return http.fetchFormData(REMOTE_URL + `/flowable/model/deploy`, params)
}

//新建流程信息
export const FlowNewModel = (params = {}) => {
	return http.fetchPost(REMOTE_URL + `/app/rest/models`, params,true)
}

//获取区域列表
export const FLowAreaList = (params = {}) =>
	http.fetchGet(`${REMOTE_URL}/sys/area/treeData`, params)

// 文件/图片上传接口
export const FlowUpload = (params = {}) =>
	http.fetchPost(`${REMOTE_URL}/sys/file/webupload/upload?uploadPath=/formbuilder`, params)

