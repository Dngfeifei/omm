import fetch from 'isomorphic-fetch'
import whitelist from '/api/whitelist'
import {
	message
} from 'antd'
import {
	hashHistory
} from 'react-router'
import qs from 'qs'
let countNum = false;
const handleRequest = (url, method, body = {}, json = false) => {
	let has = false
	whitelist.forEach(val => {
		if (val == url) has = true
	})

	let token, tokenName = 'token',
		wholeUrl = url;
	if (process.env.NODE_ENV == 'production') {
		tokenName = `${process.env.ENV_NAME}_${tokenName}`
		wholeUrl = `${process.env.API_URL}${url}`
	}
	token = localStorage.getItem(tokenName) || '';

	let header = Object.assign({}, {
		'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded'
	}, has ? {} : {
		'Authorization': `Bearer ${token}`
	})

	if (body instanceof FormData) {
		header = Object.assign({}, {'Content-Type': 'multipart/form-data'}, { 'Authorization': `Bearer ${token}` })
	}

	let req = {
		method,
		headers: new Headers(header)
	}
	if (method == 'POST' || method == 'PUT') {
		if (body instanceof FormData) {
			req = Object.assign({
				body
			}, req)
		} else  {
			req = Object.assign({
				body: json ? JSON.stringify(body) : body,
				bodyUsed: true
			}, req)
		}
	}
	return new Request(wholeUrl, req)
}

	const handleResponse1 = res => new Promise((rsl, rej) => {
		rsl(res.json())
	})
	.then(res => {
		return res;
	})
	.catch(err => {
		// message.error('请求超时，请联系管理员！');
		// console.error(new Error(`status: ${res.status}, statusText: ${res.statusText}`))
	})
	const handleResponse = res => new Promise((rsl, rej) => {
		rsl(res.json())
	})
	.then(res => {
		if (res.status == '2006' || res.status == '2007' || res.status == '2008') {
			if (countNum) {
				message.error(res.message);
			}
			countNum = false;
			localStorage.clear();
			window.resetStore();
			hashHistory.push('/login') //开发模式下不经过改跳转
		} else {
			countNum = true;
			return res
		}
		return undefined;
	})
	.catch(err => {
		message.error('请求超时，请联系管理员！');
		localStorage.clear();
		window.resetStore();
		hashHistory.push('/login');
		// console.error(new Error(`status: ${res.status}, statusText: ${res.statusText}`))
	})
const handleTimeout = (url, type, body = {}, json = false, times = 100000) => Promise.race([
	new Promise((rsl, rej) => {
		setTimeout(_ => {
			rsl({
				status: 500,
				statusText: 'Timeout'
			})
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
const handleDeleteParams = (params = [], s = '') => {
	let str = '';
	if (!params.length) {
		return ""
	}
	str = params && params.length && s + params.join(",");
	return encodeURI(str)
}
const handleURL = url => {
	if (process.env.NODE_ENV == 'production') {
		url = `/xpro${url}`
	}
	return url
}

const handleText = res => new Promise((rsl, rej) => {
	rsl(res.text())
})
	.then(res => {

		countNum = true;
		return res
	})
	.catch(err => {
		message.error('请求超时，请联系管理员！');
		hashHistory.push('/login');
		console.error(new Error(`status: ${res.status}, statusText: ${res.statusText}`))
	})


export default {
	tools: {
		handleParams,
		handleURL
	},
	fetchGet(url, params = {}, times = 100000) { //get接口调用
		return handleTimeout(`${url}${handleParams(params, '?')}`, 'GET', null, null, times)
			.then(handleResponse)
	},
	fetchGetNotest(url, params = {}, times = 100000) { //get接口调用,当不进行接口报错处理的时候使用
		return handleTimeout(`${url}${handleParams(params, '?')}`, 'GET', null, null, times)
			.then(handleResponse1)
	},
	fetchPost(url, params = {}, json = false, times = 100000) { //post接口调用
		return handleTimeout(url, 'POST', json ? params : handleParams(params), json, times)
			.then(handleResponse)
	},
	fetchDelete(url, params = [], json = false, times = 100000) { //Delet接口
		return handleTimeout(`${url}${handleDeleteParams(params, '/')}`, 'DELETE', null, null, times)
			.then(handleResponse)
	},
	fetchFormData(url, params = {}, json = false, times = 100000) { //post接口调用
		return handleTimeout(url, 'POST',qs.stringify(params), json, times)
			.then(handleResponse)
	},
	fetchPut(url, params = {}, json = false, times = 100000) { //put接口
		return handleTimeout(url, 'PUT', json ? params : handleParams(params), json, times)
			.then(handleResponse)
	},
	fetchGetXml(url, params = {}, times = 100000) { //get接口 xml 信息
		return handleTimeout(`${url}${handleParams(params, '?')}`, 'GET', null, null, times)
			.then(handleText)
	},
	fetchBlob(url, params = {}) { //get下载接口
		return handleTimeout(`${url}${handleParams(params, '?')}`, 'GET', null, null, 900000).then(function (response) {
			if (response.status != 200) {
				message.error(response.message)
				return null;
			} else {
				let filename = decodeURI(response.headers.get('Content-Disposition').split('filename=')[1]);
				response.arrayBuffer().then(response => {
					let blobObj = new Blob([response], {
						type: "application/vnd.ms-excel"
					});
					let url = window.URL.createObjectURL(blobObj);
					var a = document.createElement("a");
					document.body.appendChild(a);
					a.href = url;
					a.download = decodeURI(filename);
					a.click();
					document.body.removeChild(a);
				});
			}
		})
	},
	fetchBlobPost(url, params = {}, json = false, ) {
		return handleTimeout(url, 'POST', json ? params : handleParams(params), null, 900000).then(function (response) {
			if (response.status != 200) {
				message.error(response.message)
				return null;
			} else {
				let hasContnt = response.headers.get('Content-Disposition')
				if (hasContnt == null) { //通过判断是否含有content属性 来区分是否是正常工作流的下载还是返回的错误json信息？
					response.json().then(res => {
						if (res.status != 200) {
							message.error(res.message)
						}
					})
					return
				}
				let filename = decodeURI(response.headers.get('Content-Disposition').split('filename=')[1]);
				let contentType = decodeURI(response.headers.get('content-type'));
				response.arrayBuffer().then(response => {
					let blobObj = new Blob([response], {
						// type: "application/vnd.ms-excel"
						type: contentType
					});
					let url = window.URL.createObjectURL(blobObj);
					var a = document.createElement("a");
					document.body.appendChild(a);
					a.href = url;
					a.download = decodeURI(filename);
					a.click();
					document.body.removeChild(a);
				});
			}
		})
	}
}
