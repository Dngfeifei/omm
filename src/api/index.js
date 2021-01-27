import fetch from 'isomorphic-fetch'
import whitelist from '/api/whitelist'
import { message } from 'antd'
import { hashHistory } from 'react-router'
import qs from 'qs'
const handleRequest = (url, method, body = {}, json = false) => {
	let has = false
	whitelist.forEach(val => {
		if (val == url) has = true
	})

	let token = localStorage.getItem('token') || ''
	let header = Object.assign({}, {
		'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded'
	}, has ? {} : {
		'Authorization': `Bearer ${token}`
	})
	
	
	let req = {
		method,
		headers: new Headers(header)
	}
	if (method == 'POST' || method == 'PUT') {
		console.log(body,2)
		req = Object.assign({
			body: json ? JSON.stringify(body) : body,
			bodyUsed: true
		}, req)
	}
	// let wholeUrl = `${process.env.API_URL}${url}`
	let wholeUrl = url
	if (process.env.NODE_ENV == 'production') {
		wholeUrl = url.split('/')[1] == 'static' ? `${url}` : `${process.env.API_URL}${url}`
		//wholeUrl = `${process.env.API_URL}${url}`
	}

	return new Request(wholeUrl, req)
}

const handleResponse = res => new Promise((rsl, rej) => {
		rsl(res.json())
})
.then(res => {
	if (res.code == 700) {
		localStorage.clear();
		window.resetStore();
		hashHistory.push('/login') //开发模式下不经过改跳转
	} else if (res.code != 200) {
		// message.error(res.message);
	}
	//
	return res
})
.catch(err => {
	message.error('请求超时');
	console.error(new Error(`status: ${res.status}, statusText: ${res.statusText}`))
})

const handleTimeout = (url, type, body = {}, json = false, times = 100000) => Promise.race([
	new Promise((rsl, rej) => {
		setTimeout(_ => {
			rsl({status: 500, statusText: 'Timeout'})
		}, times)
	}),
	fetch(handleRequest(url, type, body, json))
])
//get获取数据格式化参数方法
const handleParams = (params, s = '') => {
	let str = ''
	let timestamp = 'timestamp=' + Date.parse(new Date()).toString()
	for (let i in params) {
		if (params[i] != undefined && params[i] != null) {
			if (Array.isArray(params[i])) {
				str += qs.stringify({
					[i]: params[i]
				}, {
					arrayFormat: 'repeat'
				}) + '&'
			} else {
				str += `${i}=${params[i]}&`
			}
		}
	}
	if (str.length) {
		str = `${s}${str}${timestamp}`
	} else {
		str = `${s}${timestamp}`
	}
	return encodeURI(str)
}
//删除方法单个或批量操作格式化参数方法
const handleDeleteParams = (params =[],s ='') => {
	let str = '';
	str = params && params.length && s + params.join(",");
	return encodeURI(str)
}
const handleURL = url => {
	if (process.env.NODE_ENV == 'production') {
		url = `/xpro${url}`
	}
	return url
}


export default {
	tools: {
		handleParams, handleURL
	},
	fetchGet (url, params = {}, times = 100000) { //get接口调用
		return handleTimeout(`${url}${handleParams(params, '?')}`, 'GET', null, null, times)
		.then(handleResponse)
	},
	fetchPost (url, params = {}, json = false, times = 100000) {//post接口调用
		return handleTimeout(url, 'POST', json ? params : handleParams(params), json, times)
		.then(handleResponse)
	},
	fetchDelete (url, params = {}, json = false, times = 100000) {//Delet接口
		return handleTimeout(`${url}${handleDeleteParams(params, '/')}`, 'DELETE', null, null, times)
		.then(handleResponse)
	},
	fetchPut (url, params = {}, json = false, times = 100000) {//put接口
		return handleTimeout(url, 'PUT', json ? params : handleParams(params), json, times)
		.then(handleResponse)
	},
	fetchBlob (url, params = {}) {//get下载接口
		return handleTimeout(`${url}${handleParams(params, '?')}`, 'GET', null, null, 900000).then(function(response) {
			if(response.status == 901){
				message.error('没有找到对应的资料')
				return null;
			}else{
				 let filename = decodeURI(response.headers.get('Content-Disposition').split('filename=')[1]);
				 response.arrayBuffer().then(response => {
					let blobObj = new Blob([response], {type: "application/vnd.ms-excel"});
	                let url = window.URL.createObjectURL(blobObj);
	                var a = document.createElement("a");
	                document.body.appendChild(a);
	                a.href = url;
	                a.download = decodeURI(filename);
	                a.click();
	                document.body.removeChild(a);
				 });
			}
		})
	},
	fetchBlobPost (url, params = {},json = false,) {
		console.log(params,1)
		return handleTimeout(url, 'POST', json ? params : handleParams(params), null, 900000).then(function(response) {
			if(response.status == 901){
				message.error('没有找到对应的资料')
				return null;
			}else{
				let filename = decodeURI(response.headers.get('Content-Disposition').split('filename=')[1]);
				response.arrayBuffer().then(response => {
				   let blobObj = new Blob([response], {type: "application/vnd.ms-excel"});
                   let url = window.URL.createObjectURL(blobObj);
                   var a = document.createElement("a");
                   document.body.appendChild(a);
                   a.href = url;
                   a.download = decodeURI(filename);
                   a.click();
                   document.body.removeChild(a);
				});
			}
		})
	}
}
