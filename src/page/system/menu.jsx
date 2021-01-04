import React from 'react'
import { Input, Button, Icon, Modal } from 'antd'
import { getMenuTree, deleteMenu } from '/api/menu'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import MenuForm from '/components/menu/menuForm.jsx'
import { handleTreeData } from '/api/tools'


class Menu extends Common{

async componentWillMount () {
		this.search()
	}
	state = {
		columns: [{
			title: '菜单名称',
			dataIndex: 'name'
		},{
			title: '菜单编号',
			dataIndex: 'code'
		}, {
			title: '排序',
			dataIndex: 'num'
		},  {
			title: '是否菜单',
			dataIndex: 'ismenu',
			render: (t) => Number(t) == 0 ? '否' : Number(t) == 1 ? '是' : ''
		},  {
			title: '是否启用',
			dataIndex: 'status',
			render: (t) => Number(t) == 0 ? '否' : Number(t) == 1 ? '是' : ''
		}, {
			title: '备注',
			dataIndex: 'tips'
		}],
		pagination: false,
		selectedtable: true,
		selected: {},
		loading: true,
		modalconf: {visible: false, item: {}},
		search: {name: ''},
		treeMenu: []
	}

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if (!search.condition) delete search.condition
		return getMenuTree(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				if (val.childList && val.childList.length) {
					let item = Object.assign({}, baseItem, {
						children: f(f)(val.childList)
					})
					delete item.childList
					return item
				}
				return baseItem
			}))(res.data)
			this.setState({
				tabledata: data, 
				loading: false,
				treeMenu: handleTreeData(data, 'name', 'code', 'children')
			})
		})
	}

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deleteMenu, 'menuId', '删除', 'deleteback')
	}

	done = async _ => {
		let type = this.state.modalconf.type
		let config = {}
		config.modalconf = {visible: false, item: {}}
		this.setState(config)
		if (type == 'add') {
			this.research()
		} else {
			await this.setState({selected: {}})
			this.search()
		}
	}

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<Input 
			value={this.state.search.name}
			allowClear
			onChange={e => this.changeSearch({name: e.target.value})}
			addonBefore="菜单名称" placeholder="输入菜单名称" />
			
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
		</div>
	</div>

	renderBtn = _ => <div>
	<ButtonGroup>
		<Button 
		onClick={_ => this.addmodal('modalconf', '添加菜单')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '编辑菜单')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
	</ButtonGroup>
	</div>

	rendermodal = _ => <div><MenuForm 
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
		getTree={_ => this.search()}
		treeMenu={this.state.treeMenu}
		config={this.state.modalconf} />,
		<Modal title="信息"
		  visible={this.state.visible}
		  onOk={this.delete}
		  mask={false}
		  width={400}
		  onCancel={this.changemodel}
		  okText="确认"
		  cancelText="取消"
		>
			<p>是否删除？</p>
		</Modal> </div>

}

export default Menu