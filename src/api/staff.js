import http from '/api'

export const getStaffList = (params = {}) =>
	http.fetchGet(`/staffBasic/list`, params)

export const deleteStaff = (params = {}) =>
	http.fetchGet(`/staffBasic/delete`, params)	

export const addStaff = (params = {}) =>
	http.fetchPost(`/staffBasic/add`, params, true)

export const getDetail = (params = {}) =>
	http.fetchGet(`/staffBasic/getDetail`, params)

export const getStaffTechList = (params = {}) =>
	http.fetchGet(`/staffTech/list`, params)
//删除技能
export const deleteStaffTech = (params = {}) =>
	http.fetchGet(`/staffTech/delete`, params)
//添加技能
export const addStaffTech = (params = {}) =>
	http.fetchPost(`/staffTech/add`, params, true)

export const getStaffCertList = (params = {}) =>
	http.fetchGet(`/staffCert/list`, params)
//删除证书
export const deleteStaffCert = (params = {}) =>
	http.fetchGet(`/staffCert/delete`, params)
//添加证书
export const addStaffCert = (params = {}) =>
	http.fetchPost(`/staffCert/add`, params, true)

export const getStaffProjList = (params = {}) =>
	http.fetchGet(`/staffProj/list`, params)
//删除项目经验
export const deleteStaffProj = (params = {}) =>
	http.fetchGet(`/staffProj/delete`, params)
//添加项目经验
export const addStaffProj = (params = {}) =>
	http.fetchPost(`/staffProj/add`, params, true)

export const getStaffWorkList = (params = {}) =>
	http.fetchGet(`/staffWork/list`, params)
//删除项目经验
export const deleteStaffWork = (params = {}) =>
	http.fetchGet(`/staffWork/delete`, params)
//添加项目经验
export const addStaffWork = (params = {}) =>
	http.fetchPost(`/staffWork/add`, params, true)

export const getStaffEduList = (params = {}) =>
	http.fetchGet(`/staffEdu/list`, params)
//删除教育经历
export const deleteStaffEdu = (params = {}) =>
	http.fetchGet(`/staffEdu/delete`, params)
//添加教育经历
export const addStaffEdu = (params = {}) =>
	http.fetchPost(`/staffEdu/add`, params, true)

export const getStaffTrainList = (params = {}) =>
	http.fetchGet(`/staffTrain/list`, params)
//删除培训经历
export const deleteStaffTrain = (params = {}) =>
	http.fetchGet(`/staffTrain/delete`, params)
//添加培训经历
export const addStaffTrain = (params = {}) =>
	http.fetchPost(`/staffTrain/add`, params, true)

//查询证书
export const getcertselect = (params = {}) =>
	http.fetchGet(`/staffCert/select`, params)

export const getStaffPicList = (params = {}) =>
	http.fetchGet(`/staffPic/list`, params)
//删除影像资料
export const deleteStaffPic = (params = {}) =>
	http.fetchGet(`/staffPic/delete`, params)
//添加影像资料
export const addStaffPic = (params = {}) =>
	http.fetchPost(`/staffPic/add`, params, true)
//查询影像资料
export const getpicselect = (params = {}) =>
	http.fetchGet(`/staffPic/select`, params)
//获得纸质证书借用情况
export const getcertpaperlist = (params = {}) =>
	http.fetchGet(`/staffCert/getCertPaperList`, params)
export const returnPaper = (params = {}) =>
	http.fetchGet(`/staffCert/returnPaper`, params)
export const renewPaper = (params = {}) =>
	http.fetchGet(`/staffCert/renewPaper`, params)		
//批量归还
export const returnMutiPaper = (params = {}) => {
	return http.fetchGet(`/staffCert/returnMutiPaper`, params)
}
//批量续借
export const renewMutiPaper = (params = {}) => {
	return http.fetchGet(`/staffCert/renewMutiPaper`, params)
}	

export const importURL = http.tools.handleURL('/staffBasic/importStaffs')

export const exportStaffs = (params = {}) => {
	return http.fetchBlob(`/staffBasic/exportStaffs`, params)
}
//导出人员信息
export const exportStaffInfo = (params = {}) => {
	return http.fetchBlob(`/staffBasic/exportStaffInfo`, params)
}
//查询OA人员信息
export const getConditionMembers = (params = {}) =>
	http.fetchGet(`/staffBasic/getConditionMembers`, params)	
//人员基本信息复核
export const checkDone = (params = {}) =>
	http.fetchGet(`/staffBasic/checkDone`, params)	
//人员证书复核
export const checkDoneCert = 	(params = {}) =>
	http.fetchGet(`/staffCert/checkDoneCert`, params)
//人员证书未复核原因
export const setCheckDesp = 	(params = {}) =>
	http.fetchGet(`/staffCert/setCheckDesp`, params)	
//人员资料复核
export const checkDonePic = (params = {}) =>
	http.fetchGet(`/staffPic/checkDonePic`, params)
//获得人员的全部资料信息
export const getStaffInfo = (params = {}) =>
	http.fetchGet(`/staffBasic/getStaffInfo`, params)
//获得申请流程中已选择的人员信息
export const geSelectedStaff = (params = {}) =>
	http.fetchGet(`/staffBasic/geSelectedStaff`, params)
//高级查询
export const highSearch = (params = {}) =>
	http.fetchGet(`/staffBasic/highSearch`, params)
//获得本人身份证号
export const getUserIdnum = (params = {}) =>
	http.fetchGet(`/staffBasic/getUserIdnum`, params)
//上传人员照片
export const uploadDir = http.tools.handleURL('/staffBasic/upload')
