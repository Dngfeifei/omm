import React from 'react'
import ReactDom from 'react-dom'
import { Router, Route, hashHistory, IndexRedirect } from 'react-router'
import { Provider } from 'react-redux'
import Promise from 'promise-polyfill'
import Loadable from "react-loadable"
import moment from 'moment'

// 推荐在入口文件全局设置 locale
// import 'moment/locale/zh-cn'
moment.locale('zh-cn')

if (!window.Promise) {
  window.Promise = Promise
}
// 登录前的path
window.LOGIN_LAST_PATH = null
import '/assets/less/main.less'
import store from '/redux/store'
import '/assets/less/main.less'
import Loading from '/components/loading.jsx'
const Load = loader => Loadable({
   loader,
   loading: Loading
})

const Page = Load(() => import('./app.jsx'))
const Home = Load(() => import('/page/home.jsx'))
const Container = Load(() => import('/page/container.jsx'))
const Login = Load(() => import('/page/login.jsx'))
// const ChangePassForm = Load(() => import('/page/changePassword.jsx'))

const routeConfig = (
	<Route path = {'/'} component = {Page}>
		<IndexRedirect to="/home/container"/>
		<Route path = {'home'} component = {Home}>
			<Route path = {'container'} component = {Container} />
		</Route>
		<Route path = {'login'} component = {Login}/>
	</Route>
)

ReactDom.render(
	<Provider store = { store }>
		<Router history = { hashHistory }>
        	{routeConfig}
		</Router>
	</Provider>
	,
    document.getElementById('root')
)