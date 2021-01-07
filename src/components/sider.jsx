import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Icon, Badge } from 'antd'
const { Sider } = Layout
const { SubMenu } = Menu
import { ADD_PANE, GET_MENU } from '/redux/action'
import {getPost} from '@/api/global.js'


@connect(state => ({
	menu: state.global.menu,
	collapsed: state.global.collapsed,
	activeKey: state.global.activeKey,
}), dispath => ({
	getMenu(){dispath({type: GET_MENU})},
	add(pane){dispath({ type: ADD_PANE, data: pane })}
}))
class DSider extends Component{
	 async componentWillMount () {
		await this.props.getMenu()
	}

	componentWillReceiveProps (nextprops) {
		if(this.props.menu.length == 0 && nextprops.menu.length > 0){
			nextprops.menu.forEach(item => {
				if(item.resourcePath == 'notice'){
					this.add(item)
				}
			})
		}
		// if(this.props.collapsed != nextprops.collapsed && nextprops.collapsed==true){
		// 	this.setState({openKeys: []})// 在菜单收缩之前，先把打开的子菜单收缩
		// }
	}

	state = {
		openKeys: []
	}

	add = (item) => {
		let pane = {
			title: item.resourceName, 
			key: item.id,
			url: item.resourcePath,
			breadcrumb: (item.pcodes + ',' + item.resourceName).split(",")
		}
		this.props.add(pane)
	}
	select = (item) => {
		if (this.state.openKeys[0] == item.id) {
			this.setState({openKeys: []})
		} else {
			this.setState({openKeys: [item.id]})
		}
	}
	renderMenuTitle = val => <span>
		{val.icon ? <Icon type={val.icon} /> : <Icon  type="pie-chart"/>}
		<span>{val.resourceName}</span>
	</span>

	render = _ => <Sider 
	trigger={null}
    collapsed={this.props.collapsed}
	width={220} 
	style={{ background: '#fff' }}>
		<div className={this.props.collapsed?'avatar-wrapper collaps':'avatar-wrapper'}>
			{<div className="logo">
				<Icon type="question-circle" className="icon"/>
				<span className="username">银信业务支持平台</span>
			</div>}
		</div>
        <Menu
          mode="inline"
          selectedKeys={[this.props.activeKey]}
		//    openKeys={this.state.openKeys}
          theme="dark"
          style={{ borderRight: 0 }}>
			{
			this.props.menu.map(val => {
        		if (val.children && val.children.length) {
        			return <SubMenu 
        			key={val.id}
        			onTitleClick={this.select}
        			title={this.renderMenuTitle(val)}>
			            {val.children.map(item => {
			            	if (item.children && item.children.length) {
			        			return <SubMenu 
			        			key={item.id} 
			        			onTitleClick={this.select}
			        			title={this.renderMenuTitle(val)}>
						            {item.children.map(item => 
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
        	})
			}
			
        </Menu>
     </Sider>
}

export default DSider



