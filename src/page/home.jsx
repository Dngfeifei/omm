import React, { Component } from 'react'
import { Layout, Button, notification, List, Modal } from 'antd'
import { getUnviewMessage } from '/api/notice'
import { getInitPassordInfo } from '/api/mgr'
const { Content } = Layout

import Header from '/components/header.jsx'
import Sider from '/components/sider.jsx'
import Loading from '/components/loading.jsx'
import ChangeInitPwd from '/page/changeInitpwd.jsx'

class Home extends Component{

	state = Object.assign({}, this.state, {
		visible: false,
		verData: {}
	})

	componentWillMount = _ => {
		notification.config({
		  placement: 'bottomRight',
		  bottom: 50,
		  duration: 3,
		})
    this.openNotification()
    //强制修改初始密码
    this.alterInitPassword()
  }

	openNotification = () => {
		getUnviewMessage({}).then(res => {
			if(res.code == 200){
				res.data.forEach(item => {
					notification.open({
				  	placement: 'bottomRight',
				    message: '系统消息',
				    description: item.content
				  })
				})
			}
		})
	}

	alterInitPassword = () => {
		getInitPassordInfo({}).then(res => {
			if(res.code == 200){
				if(!res.data.version || res.data.version == 0){//未修改初始密码
					this.setState({visible: true, verData: res.data})
				}
			}
		})
	}

	closeInitPassword = () => {
		this.setState({visible: false})
	}

	render = _ => 
		<Layout className='wrapper'>
			<Sider />
			<Layout>
				<Header />
				<Content style = {{paddingLeft: 4}}>{this.props.children}</Content>
			</Layout>
			<ChangeInitPwd config={{visible: this.state.visible, data: this.state.verData}}
				onCancel = {_ => this.closeInitPassword()}
			>
			</ChangeInitPwd>
		</Layout>
}

export default Home