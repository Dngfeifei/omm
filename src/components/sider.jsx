import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Icon, Badge } from 'antd'
const { Sider } = Layout
const { SubMenu } = Menu
import { ADD_PANE, GET_MENU ,TOGGLE} from '/redux/action'
import {getPost} from '@/api/global.js'


@connect(state => ({
	menu: state.global.menu,
	collapsed: state.global.collapsed,
	activeKey: state.global.activeKey,
}), dispath => ({
	getMenu(){dispath({type: GET_MENU})},
	add(pane){dispath({ type: ADD_PANE, data: pane })},
	setCollapsed(){dispath({ type: TOGGLE})}
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
	}

	state = {
		openKeys:[],
		contNum: 0 
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
	//监听菜单缩放事件并重置collapsed触发收缩
	collapsed = (collapsed, type) => {
		let {contNum} = this.state;
		// console.log(contNum)//,this.setState({contNum: contNum++})
		contNum && this.props.collapsed !== collapsed && this.props.setCollapsed(),contNum++,this.setState({contNum});
	}
	render = _ => <Sider 
	trigger={null}
	collapsed={this.props.collapsed}
	collapsedWidth={60}
	breakpoint={'xl'}
	onCollapse={this.collapsed}
	width={220} 
	style={{ background: '#fff' }}>
		
        <Menu
          mode="inline"
          selectedKeys={[this.props.activeKey]}
		//    openKeys={this.state.openKeys}
		inlineCollapsed={true}
		// inlineIndent={12}
          theme="light"
          style={{ borderRight: '1px solid transparent' ,backgroundColor:'transparent'}}
		  >
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



