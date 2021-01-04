import React from 'react'
import { Input, Button, Icon, Modal } from 'antd'
import { getStaffTrainList, deleteStaffTrain } from '/api/staff'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import StafftrainForm from '/page/staff/stafftrainForm.jsx'

class StaffTrain extends Common{
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
			title: '培训日期',
			dataIndex: 'trainDate'
		},{
			title: '结业日期',
			dataIndex: 'overDate'
		},{
			title: '培训机构',
			dataIndex: 'trainName'
		},{
			title: '培训内容',
			dataIndex: 'content'
		},{
			title: '获得证书',
			dataIndex: 'cert'
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
		return getStaffTrainList({staffId: this.props.staffId})
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
		this.handleOk(deleteStaffTrain, 'id', '删除', 'deleteback')
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
		onClick={_ => this.props.staffId ? this.addmodal('modalconf', '添加培训经历') : message.error('请先保存人员基础信息')}
		type="primary" icon="plus">添加</Button>
		<Button 
		onClick={_ => this.editmodal('modalconf', '修改培训经历')}
		type="primary" icon="edit">修改</Button>
		<Button 
		onClick={this.changemodel}
		type="primary" icon="close">删除</Button>
	</ButtonGroup>
	</div> : null

	rendermodal = _ => <div>
	<StafftrainForm 
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

export default StaffTrain