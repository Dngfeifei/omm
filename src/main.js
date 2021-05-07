import React from 'react'
import ReactDom from 'react-dom'
import { Router, Route, hashHistory, IndexRedirect } from 'react-router'
import { Provider } from 'react-redux'
import Promise from 'promise-polyfill'
import Loadable from "react-loadable"
import moment from 'moment'

import '/assets/less/main.less' //加载全局样式

// 推荐在入口文件全局设置 locale
// import 'moment/locale/zh-cn'
moment.locale('zh-cn')

if (!window.Promise) {
  window.Promise = Promise
}
//引入全局状态管理数仓
import store from '/redux/store'

// 登录前的path
window.LOGIN_LAST_PATH = null


//引入loading效果组件
import Loading from '/components/loading.jsx'
const Load = loader => Loadable({
   loader,
   loading: Loading
})

//引入路由相关组件
const Page = Load(() => import('./app.jsx'))
const Home = Load(() => import('/page/home.jsx'))
const Container = Load(() => import('/page/container.jsx'))
const Login = Load(() => import('/page/login.jsx'))
// 重置密码与 修改密码
const initPassForm = Load(() => import('/page/ChangePassword/initializingPassword.jsx'))
// 首次登陆重置密码
const ChangePassForm = Load(() => import('/page/ChangePassword/changePassword.jsx'))



//配置路由信息
const routeConfig = (
	<Route path = {'/'} component = {Page}>
		<IndexRedirect to="/home/container"/>
		<Route path = {'home'} component = {Home}>
			<IndexRedirect to="/home/container"/>
			<Route path = {'container'} component = {Container} />
		</Route>
		<Route path = {'login'} component = {Login}/>
		<Route path = {'initPassForm'} component = {initPassForm}/>
		<Route path = {'ChangePassForm'} component = {ChangePassForm}/>
	</Route>
)

//挂载组件
ReactDom.render(
	<Provider store = { store }>
		<Router history = { hashHistory }>
        	{routeConfig}
		</Router>
	</Provider>
	,
    document.getElementById('root')
)