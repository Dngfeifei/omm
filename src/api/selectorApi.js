/****
 * 此API接口主要封装在 /components/selector/projectSelector.jsx下的接口
 * 
 * 包含-项目选择器接口、客户选择器接口
 * 
 * @author jxl
 */


import http from './index'



// 项目选择器（分页）
export const getProjectSelector = (limit,offset,params = {}) => {
	return http.fetchPost(`/biProject/selector?limit=${limit}&offset=${offset}`, params, true)
}


