import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Icon, Badge } from 'antd'
const { Sider } = Layout
const { SubMenu } = Menu
import { ADD_PANE, GET_MENU, GET_THISROLE, GET_TODOCOUNT } from '/redux/action'


@connect(state => ({
	menu: state.global.menu,
	collapsed: state.global.collapsed,
	activeKey: state.global.activeKey,
	thisrole: state.global.thisrole,
	todoCount: state.global.todoCount,
}), dispath => ({
	getMenu(){dispath({type: GET_MENU})},
	add(pane){dispath({ type: ADD_PANE, data: pane })},
	getThisrole(){dispath({type: GET_THISROLE})},
	getTodoCount(){dispath({type: GET_TODOCOUNT})},
}))
class DSider extends Component{
	 async componentWillMount () {
		await this.props.getMenu()
		this.props.getThisrole()
	    this.props.getTodoCount()
	    setInterval(this.props.getTodoCount, 300000)
	}

	componentWillReceiveProps (nextprops) {
		if(this.props.menu.length == 0 && nextprops.menu.length > 0){
			nextprops.menu.forEach(item => {
				if(item.code == 'notice'){
					this.add(item)
				}
			})
		}
		if (this.props.activeKey != nextprops.activeKey && nextprops.activeKey) {
			this.setState({selectedKeys: [nextprops.activeKey]})
		}
		if(this.props.collapsed != nextprops.collapsed && nextprops.collapsed==true){
			this.setState({openKeys: []})// 在菜单收缩之前，先把打开的子菜单收缩
		}
	}

	state = {
		selectedKeys: [],
		openKeys: []
	}

	add = item => {
		this.setState({selectedKeys: [item.id]})
		let pane = {
			title: item.name, 
			key: item.id,
			url: item.code
		}
		this.props.add(pane)
	}
	select = item => {
		if (this.state.openKeys[0] == item.key) {
			this.setState({openKeys: []})
		} else {
			this.setState({openKeys: [item.key]})
		}
	}
	renderMenuTitle = val => <span>
		{val.icon ? <Icon type={val.icon} /> : null}
		<span>{val.name}</span>{val.name === '工作台' ? <Badge count={this.props.todoCount} style={{height: '16px', width: '16px', padding: 0, marginLeft: 6,
		minWidth: '16px', lineHeight: '16px'}}></Badge> : null}
	</span>

	render = _ => <Sider 
	trigger={null}
	collapsible
    collapsed={this.props.collapsed}
	width={170} 
	style={{ background: '#fff' }}>
		<div className="avatar-wrapper">
			{this.props.collapsed ? null : <div>
				<span className="username">业务支持平台</span>
			</div>}
		</div>
        <Menu
          mode="inline"
          selectedKeys={this.state.selectedKeys}
          openKeys={this.state.openKeys}
          theme="dark"
          style={{ borderRight: 0 }}>
        	{this.props.menu.map(val => {
        		if (val.childList && val.childList.length) {
        			return <SubMenu 
        			key={val.id} 
        			onTitleClick={this.select}
        			title={this.renderMenuTitle(val)}>
			            {val.childList.map(item => {
			            	if (item.childList && item.childList.length) {
			        			return <SubMenu 
			        			key={item.id} 
			        			onTitleClick={this.select}
			        			title={this.renderMenuTitle(val)}>
						            {item.childList.map(item => 
						            	<Menu.Item key={item.id} onClick={_ => this.add(item)}>
						            		{this.renderMenuTitle(item)}
						            	</Menu.Item>
						            )}
					          	</SubMenu>
			        		} else {
			        			return <Menu.Item key={item.id} onClick={_ => this.add(item)}>
			        				{this.renderMenuTitle(item)}
			        			</Menu.Item>
			        		}
			            })}
		          	</SubMenu>
        		} else {
        			return <Menu.Item key={val.id} onClick={_ => this.add(val)}>
        				{this.renderMenuTitle(val)}
        			</Menu.Item>
        		}
        	})}
        </Menu>
     </Sider>
}

export default DSider



