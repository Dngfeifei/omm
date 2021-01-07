import React, { Component } from 'react'
import { Tabs, message } from 'antd'
const TabPane = Tabs.TabPane
import { connect } from 'react-redux'
import { REMOVE_PANE, SET_PANE, ADD_PANE } from '/redux/action'
import Inbox from '/page/inbox.jsx'

@connect(state => ({
	panes: state.global.panes,
	activeKey: state.global.activeKey,
}), dispath => ({
	remove(key){dispath({type: REMOVE_PANE, key})},
	setKey(key){dispath({type: SET_PANE, data: key})},
	add(pane){dispath({ type: ADD_PANE, data: pane })}
}))
class Container extends Component{
	componentWillMount = _ => {
		window.add = pane => this.props.add(pane)
		window.remove = key => this.props.remove(key)
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

	render = _ => 
		<div style={{width: '100%', height: '100%'}}>
			<Tabs
			  className="nav-tabs"
	          hideAdd
	          onChange={this.onChange}
	          activeKey={this.props.activeKey}
			  type="editable-card"
	          onEdit={this.onEdit}
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