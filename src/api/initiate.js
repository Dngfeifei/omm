import http from './index'

// const REMOTE_URL = '/flow'
const REMOTE_URL = ''

/**
 * 流程发起 - 工作空间
 * @author lxx
 */


//  查询流程发起列表（分页）
export const BiProcessList = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/flowable/process/list`, params)


//保存外部表单数据
export const SaveActivitiAuditData = (params = {}) =>
	http.fetchPost(REMOTE_URL + `/test/activiti/testActivitiAudit/save`, params)

//启动任务
export const  HandleStartTask = (params = {}) =>
	http.fetchPost(REMOTE_URL + `/flowable/task/start`, params)


// 获取流程图信息
export const GetFlowChart = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/flowable/process/getFlowChart`, params)


// 读取历史任务列表
export const GetHistoricTaskList = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/flowable/task/historicTaskList`, params)

// 读取按钮列表
export const QueryByDefIdAndTaskId = (params = {}) =>
	http.fetchGet(REMOTE_URL + `/extension/taskDefExtension/queryByDefIdAndTaskId`, params)

// 读取驳回回退按钮
export const GetBackNodes = (params = {}) =>
	http.fetchPost(REMOTE_URL + `/flowable/task/backNodes`, params)

// 执行回退动作
export const DoBackAction = (params = {}) =>
	http.fetchPost(REMOTE_URL + `/flowable/task/back`, params)

// 执行同意动作
export const DoAuditAction = (params = {}) =>
  http.fetchFormData(REMOTE_URL + `/flowable/task/audit`, params)

// 执行终止动作
export const DoStopAction = (params = {}) =>
	http.fetchPost(REMOTE_URL + `/flowable/process/stop`, params)

// 执行转办动作
export const DoTransferAction = (params = {}) =>
	http.fetchPost(REMOTE_URL + `/flowable/task/transfer`, params)

// 执行委派动作
export const DoDelegateAction = (params = {}) =>
	http.fetchPost(REMOTE_URL + `/flowable/task/delegate`, params)


// 执行激活&挂起动作
export const SuspensionStateAction = (params = {}) =>
	http.fetchPost(REMOTE_URL + `/flowable/task/suspensionStateAction`, params)



	
