import React, { Component } from 'react'
import { Layout, Button, notification, List, Modal } from 'antd'
const { Content ,Footer} = Layout

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
			<Header />
			<Layout>
				<Sider />
				<Content style = {{paddingLeft: 4}}>
					{this.props.children}
					<Footer style={{height:40,borderTop:'1px solid #fafafa',margin:'0 -11px -11px -11px'}}>我是底部</Footer>
				</Content>
				
			</Layout>
		</Layout>
}

export default Home