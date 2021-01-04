import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, DatePicker, Icon, Modal, message, TreeSelect, Select } from 'antd'
import { getUserList, resetpassword, freezeuser, unfreezeuser, syncUsers, getOASyncDate, getNCSyncDateStr } from '/api/mgr'
import { getRoleList } from '/api/role'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group

import MgrForm from '/components/mgr/mgrEditForm.jsx'
import MGRole from '/components/mgr/selectRole.jsx'

const ManagerStatus = [{code: 1, name: '启用'}, 
{code: 2, name: '离职'}, {code: 3, name: '被删除'}]

class Mgr extends Common{
	async componentWillMount () {
		this.search()
		this.findOATime()
		getRoleList({offset: 0, limit: 99}).then(res => {
			this.setState({roles: res.data.records})
		})
	}

	state = Object.assign({}, this.state, {
		roles: [],
		search: Object.assign({}, this.state.pageconf),
		columns: [{
			title: '登录账号',
			dataIndex: 'account'
		}, {
			title: '姓名',
			dataIndex: 'name'
		}, {
			title: '性别',
			dataIndex: 'sexName'
		}, {
			title: '邮箱',
			dataIndex: 'email'
		}, {
			title: '角色',
			dataIndex: 'roleName'
		}, {
			title: '岗位',
			dataIndex: 'orgpost'
		}, {
			title: '部门',
			dataIndex: 'department'
		}, {
			title: '电话',
			dataIndex: 'phone'
		}, {
			title: '状态',
			dataIndex: 'statusName'
		}],
		syncLoading: false,
		confirmLoading: false,
		modalmessage: {visible: false, item: {}},
		roleModal: {visible: false, item: {}}
	})


	search = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		// this.handleTime(search, 'beginTime')
		// this.handleTime(search, 'endTime')
		return getUserList(search)
		.then(res => {
			let data
			data = res.data.records.map(val => Object.assign({}, val, {key: val.id}))
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


	resetPass = _ => {
		this.handleOk(resetpassword, 'userId', '重置密码')
	}

	syncUsers = _ => {
		if(!this.state.syncLoading){
			this.setState({syncLoading: true})
			syncUsers().then(data => {
				if(data.code == 200){
					message.success('同步成功')
					this.search()
					this.findOATime()
				}
				this.setState({syncLoading: false})
			})
		}
	}

	freeze = func => {
		if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
			func({ userId: this.state.selected.selectedKeys[0] })
			.then(res => {
				if (res.code == 200) {
					message.success('操作成功')
					return true
				}
				return false
			})
			.then(state => this.search())
		} else {
			message.warning('请选中表格中的某一记录！')
		}
	}

	done = async key => {
		let type = this.state.modalmessage.type
		let config = {}
		config[key] = {visible: false, item: {}}
		await this.setState(config)
		if (type == 'add' && key == 'modalmessage') {
			this.research()
		} else {
			await this.setState({selected: {}})
			this.search()
		}
	}

	onDeptSelect = async deptid => {
		await this.changeSearch({deptid})
		this.search()
	}
	//获得上次同步时间
	findOATime = async _ => {
		return getOASyncDate().then(res => {
			this.setState({synctime : res.data})
		})
	}

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<Input 
			value={this.state.search.condition}
			allowClear
			onChange={e => this.changeSearch({condition: e.target.value})}
			addonBefore="关键字" placeholder="账号/姓名/手机号" />
			<Select allowClear={true} style={{width: 200}} placeholder="选择角色" onChange={t =>this.changeSearch({roleId: t})}>
		    {this.state.roles.map(t => <Option value={t.id} key={t.id}>{t.name}</Option>)}
		  </Select>
			<Input 
			value={this.state.search.orgpost}
			allowClear
			onChange={e => this.changeSearch({orgpost: e.target.value})}
			addonBefore="岗位" />
			<Input 
			value={this.state.search.department}
			allowClear
			onChange={e => this.changeSearch({department: e.target.value})}
			addonBefore="部门" />
			<Select allowClear={true} style={{width: 200}} placeholder="选择状态" onChange={t =>this.changeSearch({status: t})}>
		    {ManagerStatus.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
		  </Select>
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>

			<ButtonGroup>
			<Button 
			onClick={_ => this.editmodal('roleModal', '角色分配')}
			type="primary" icon="usergroup-add">角色分配</Button>
			<Button 
			onClick={this.changemodel}
			type="primary" icon="reload">重置密码</Button>
			<Button 
			onClick={this.syncUsers}
			type="primary" icon="sync" loading={this.state.syncLoading}>同步组织结构</Button>
			</ButtonGroup>

			<span>上次同步时间为:{this.state.synctime}</span>
			
		</div>
	</div>
		
	
	rendermodal = _ => <div>
		<Modal title="信息"
		  visible={this.state.visible}
		  onOk={this.resetPass}
		  mask={false}
		  width={400}
		  confirmLoading={this.state.confirmLoading}
		  onCancel={this.changemodel}
		  okText="确认"
		  cancelText="取消"
		>
			<p>是否重置密码为:yx300231？</p>
		</Modal>
		<MgrForm 
		onCancel={_ => this.cancelform('modalmessage')}
		done={_ => this.done('modalmessage')}
		config={this.state.modalmessage} />
		<MGRole
		onCancel={_ => this.cancelform('roleModal')}
		done={_ => this.done('roleModal')}
		config={this.state.roleModal} />
	</div>

}

export default Mgr