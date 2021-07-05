import http from './index'

const REMOTE_URL = ''

export const getDataSource = (params) => http.fetchGet(REMOTE_URL + `/database/datalink/dataSource/treeData2`)

