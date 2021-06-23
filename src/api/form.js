import http from './index'

 const REMOTE_URL = ''

export const getFormList = (params = {}) =>
    http.fetchGet(REMOTE_URL + `/form/make/list`, params)

export const deletMakeForm = (params) => http.fetchDeleteWithKey(REMOTE_URL + `/form/make/delete`, params)

export const getFormItem = (params) => http.fetchGet(REMOTE_URL + `/form/make/queryById`, params)

export const saveFormItem = (params, isJson) => http.fetchPost(REMOTE_URL + `/form/make/saveBasicInfo`, params, isJson)

export const getTableList = (params) => http.fetchGet(REMOTE_URL + `/form/make/getTableList`, params)

export const saveFormSourceMakeForm = (params) => http.fetchPost(REMOTE_URL + `/form/make/saveFormSource`, params)

export const queryByIdMakeForm = (params) => http.fetchGet(REMOTE_URL + `/form/make/queryById`, params)

export const listGenerateForm = (params) => http.fetchPost(REMOTE_URL + `/form/generate/list`, params)

export const getProjitemList = (params) => http.fetchGet(REMOTE_URL + `/form/formOms/selector`, params)
