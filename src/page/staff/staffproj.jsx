import React from 'react'
import { Input, Button, Icon, Modal } from 'antd'
import { getStaffProjList, deleteStaffProj } from '/api/staff'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import StaffprojForm from '/page/staff/staffprojForm.jsx'

class StaffProj extends Common{
	async componentWillMount () {
		if(this.props.staffId){
			this.search()
		}
	}
	componentWillReceiveProps (nextprops) {
		if (this.props.staffId && nextprops.staffId !== this.props.staffId) {
			this.search()
		}
	}

	state = Object.assign({}, this.state, {
		columns: [{
			title: '项目类型',
			dataIndex: 'projType'
		},{
			title: '项目开始日期',
			dataIndex: 'projDate'
		},{
			title: '项目结束日期',
			dataIndex: 'projendDate'
		},{
			title: '项目名称',
			dataIndex: 'projName'
		},{
			title: '职责',
			dataIndex: 'duty'
		},{
			title: '环境描述',
			dataIndex: 'surrounding'
		},{
			title: '软件描述',
			dataIndex: 'software'
		},{
			title: '工作描述',
			dataIndex: 'work'
		},{
			title: '备注',
			dataIndex: 'remark'
		}],
		selectedtable: !this.props.readonly,
		pagination: false,
		selected: {},
		loading: false,
		tabledata: [],
		modalconf: {visible: false, item: {}}
	})

	search = async _ => {
		await this.setState({loading: true, selected: {}})
		return getStaffProjList({staffId: this.props.staffId})
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				return baseItem
			}))(res.data)
			this.setState({
				tabledata: data, 
				loading: false
			})
		})
	}

	deleteback = _ => {
		this.search()
	}
	delete = _ => {
		this.handleOk(deleteStaffProj, 'id', '删除', 'deleteback')
	}

	done = async _ => {
		let type = this.state.modalconf.type
		let config = {}
		config.modalconf = {visible: false, item: {}}
		this.setState(config)
		this.research()
	}

	renderBtn = _ => !this.props.readonly ? <div>
	<ButtonGroup>
		<Button 
		onClick={_ => this.props.staffId ? this.addmodal('modalconf', '添加经验') : message.error('请先保存人员基础信息')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '修改经验')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
	</ButtonGroup>
	</div> : null

	rendermodal = _ => <div>
	<StaffprojForm 
		staffId = {this.props.staffId}
		onCancel={_ => this.cancelform('modalconf')}
		done={_ => this.done()}
		getTree={_ => this.search()}
		config={this.state.modalconf} />
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
		</Modal></div>

}

export default StaffProj