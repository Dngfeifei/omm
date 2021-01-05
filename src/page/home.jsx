import React, { Component } from 'react'
import { Layout, Button, notification, List, Modal } from 'antd'
const { Content } = Layout

import Header from '/components/header.jsx'
import Sider from '/components/sider.jsx'

class Home extends Component{

	state = Object.assign({}, this.state, {
		visible: false,
		verData: {}
	})
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
		</Layout>
}

export default Home