import React, { Component } from 'react'
import { Tabs, Icon, Tooltip, message } from 'antd'
const TabPane = Tabs.TabPane
import { connect } from 'react-redux'
import { REMOVE_PANE, SET_PANE, ADD_PANE } from '/redux/action'
import Inbox from '/page/inbox.jsx'

import { login } from '/api/login'


@connect(state => ({
	panes: state.global.panes,
	activeKey: state.global.activeKey,
}), dispath => ({
	remove(key) { dispath({ type: REMOVE_PANE, key }) },
	setKey(key) { dispath({ type: SET_PANE, data: key }) },
	add(pane) { dispath({ type: ADD_PANE, data: pane }) }
}))
class Container extends Component {
	componentWillMount() {
		this.singleSignOn()
	}
	onChange = key => {
		this.props.setKey(key)
	}
	onEdit = (targetKey, action) => {
		this[action](targetKey)
	}
	remove = activeKey => {
		this.props.remove(activeKey)
	}
	//单点登录
	singleSignOn = () => {
		let querys = Object.assign({}, this.props.location.query)
		if (querys.hasOwnProperty("ticket")) {
			let ticketVal = querys["ticket"];
			login({ "ticket": ticketVal }).then(async res => {
				await this.setState({ lock: false })
				if (res.status == '200') {
					// message.success('登录成功')
					let user = res.data
					let name = '';
					if (process.env.NODE_ENV == 'production') {
						name = process.env.ENV_NAME + '_'
					}
					await localStorage.setItem(`${name}token`, user.token)
					await localStorage.setItem(`${name}userid`, user.userId)
					await localStorage.setItem(`${name}username`, user.userName)
					await localStorage.setItem(`${name}realName`, user.realName)
					this.props.setLogin(false)
					localStorage.setItem(`loginStatus`, 2)
					hashHistory.push('/')
				} else {
					message.error(res.message)
				}
			})
		}
	}
	render = _ =>
		<div style={{ flex: 1 }}>
			<Tabs
				className="nav-tabs"
				hideAdd
				onChange={this.onChange}
				activeKey={this.props.activeKey}
				type="editable-card"
				onEdit={this.onEdit}
			//   tabBarExtraContent={<Icon type="close-circle" />}
			>
				{this.props.panes.map(pane =>
					<TabPane
						tab={pane.title}
						key={pane.key}>
						<Inbox pane={pane} />
					</TabPane>
				)}
			</Tabs>
		</div>
}

export default Container