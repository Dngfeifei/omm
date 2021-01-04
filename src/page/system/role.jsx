import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Icon, Modal } from 'antd'
import { getRoleList, deleteRole } from '/api/role'
import { GET_ROLE_TREE } from '/redux/action'
import Common from '/page/common.jsx'

import RoleForm from '/components/role/roleEditForm.jsx'
import RoleAuthority from '/components/role/roleAuthority.jsx'

const ButtonGroup = Button.Group

@connect(state => ({}), dispath => ({
	getRoleTree(){dispath({type: GET_ROLE_TREE})}
}))
class Role extends Common{
	async componentWillMount () {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf),
		columns: [{
			title: '名称',
			dataIndex: 'name'
		}, {
			title: '排序',
			dataIndex: 'num'
		}, {
			title: '说明',
			dataIndex: 'tips'
		}],
		editModalConf: {visible: false, item: {}},
		roleModal: {visible: false, item: {}},
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if (!search.roleName) delete search.roleName
		return getRoleList(search)
		.then(res => {
			let data = res.data.records.map(val => Object.assign({}, val, {key: val.id}))
			this.setState({
				tabledata: data, 
				loading: false,
				pagination: Object.assign({}, this.state.pagination, {
					total: Number(res.data.total),
					current: Number(res.data.current)
				})
			})
		})
	}

	deleteBack = async _ => {
		this.search()
		this.props.getRoleTree()
	}

	delete = _ => {
		this.handleOk(deleteRole, 'roleId', '删除', 'deleteBack')
	}

	done = async key => {
		let type = this.state.editModalConf.type
		let config = {}
		config[key] = {visible: false, item: {}}
		this.setState(config)
		if (type == 'add' && key == 'editModalConf') {
			this.research()
		} else {
			await this.setState({selected: {}})
			this.search()
		}
	}

	renderSearch = _ => <div className="mgrSearchBar">
		<Input 
		value={this.state.search.roleName}
		allowClear
		onChange={e => this.changeSearch({roleName: e.target.value})}
		addonBefore="角色名称" />
		<Button 
		onClick={this.search}
		type="primary" icon="search">搜索</Button>

	<ButtonGroup>
		<Button 
		onClick={_ => this.addmodal('editModalConf', '添加角色')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('editModalConf', '编辑角色')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
		<Button 
		onClick={_ => this.editmodal('roleModal', '权限配置')}
		type="primary" icon="usb">权限配置</Button>
		</ButtonGroup>
	</div>

	rendermodal = _ => <div>
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
		</Modal>
		<RoleForm 
		onCancel={_ => this.cancelform('editModalConf')}
		done={_ => this.done('editModalConf')}
		config={this.state.editModalConf} />
		<RoleAuthority
		onCancel={_ => this.cancelform('roleModal')}
		done={_ => this.done('roleModal')}
		config={this.state.roleModal} />
	</div>

}

export default Role