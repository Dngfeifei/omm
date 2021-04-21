import React, { Component } from 'react'
import { Layout, Button, notification, List, Modal } from 'antd'
const { Content ,Footer} = Layout

import Header from '/components/header.jsx'
import Sider from '/components/sider.jsx'
import FooterD from '/components/footer.jsx'
import WaterMark from '/components/watermark/WaterMark.jsx'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import {RESET} from '/redux/action'
@connect(state => ({
	loginStatus: state.global.loginStatus,
}), dispath => ({
	reset() { dispath({ type: RESET }) }
}))
class Home extends Component{
	state = Object.assign({}, this.state, {
		visible: false,
	})
	closeInitPassword = () => {
		this.setState({visible: false})
	}
	//监测pros的动太信息
	static getDerivedStateFromProps (nextProps, prevState) {
		localStorage.getItem('loginStatus')
		if (localStorage.getItem('loginStatus') == 1) {
			localStorage.clear();
			nextProps.reset();
			hashHistory.push('/login')
		}
		return null;
	  }

	render = _ => 
	<WaterMark>
		<Layout className='wrapper'>
			<Header />
			<Layout>
				<Sider />
				<Content style = {{display: 'flex',flexDirection:'column'}}>
					{this.props.children}
					<FooterD />
				</Content>
			</Layout>
		</Layout>
	</WaterMark>
}

export default Home