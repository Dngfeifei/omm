import fetch from 'isomorphic-fetch'
import whitelist from '/api/whitelist'
import { message } from 'antd'
import { hashHistory } from 'react-router'

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
	if (method == 'POST') {
		req = Object.assign({
			body: json ? JSON.stringify(body) : body,
			bodyUsed: true
		}, req)
	}

	// let wholeUrl = `${process.env.API_URL}${url}`
	let wholeUrl = url

	if (process.env.NODE_ENV == 'production') {
		wholeUrl = `/xpro${url}`
	}

	return new Request(wholeUrl, req)
}

const handleResponse = res => new Promise((rsl, rej) => {
		rsl(res.json())
})
.then(res => {
	if (res.code == 700) {
		//message.warning('请先登录')
		//window.LOGIN_LAST_PATH = hashHistory.getCurrentLocation().pathname
		//hashHistory.push('/login') //开发模式下不经过改跳转
	} else if (res.code != 200) {
		message.error(res.message)
	}
	//
	return res
})
.catch(err => {
	message.error('请求超时')
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

const handleParams = (params, s = '') => {
	let str = ''
	let timestamp = 'timestamp='+Date.parse( new Date() ).toString()
	for(let i in params){
		if(params[i] != undefined && params[i] != null) str += `${i}=${params[i]}&`
	}
	if (str.length) {
		str = `${s}${str}${timestamp}`
	}else{
		str = `${s}${timestamp}`
	}
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
	fetchGet (url, params = {}, times = 100000) {
		return handleTimeout(`${url}${handleParams(params, '?')}`, 'GET', null, null, times)
		.then(handleResponse)
	},
	fetchPost (url, params = {}, json = false, times = 100000) {
		return handleTimeout(url, 'POST', json ? params : handleParams(params), json, times)
		.then(handleResponse)
	},
	fetchBlob (url, params = {}) {
		return handleTimeout(`${url}${handleParams(params, '?')}`, 'GET', null, null, 900000).then(function(response) {
			if(response.status == 901){
				message.error('没有找到对应的资料')
				return null;
			}else{
		  	return response.blob();
			}
		})
	},
	fetchBlobPost (url, params = {}) {
		return handleTimeout(url, 'POST', params, true, 900000).then(function(response) {
			if(response.status == 901){
				message.error('没有找到对应的资料')
				return null;
			}else{
		  	return response.blob();
			}
		})
	}
}